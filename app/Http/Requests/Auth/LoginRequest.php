<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Branch login restriction
        $user = Auth::user();
        if ($user && $user->hasRole(\App\Enums\TenantRolesEnum::BRANCHOFFICE->value)) {
            $branch = $user->branch;
            if ($branch && ! $branch->is_active) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'email' => __('Your branch is inactive. Please contact the administrator.'),
                ]);
            }
        }

        if ($user && $user->hasRole(\App\Enums\TenantRolesEnum::COUNSELLOR->value)) {
            $counsellor = $user->counsellor;
            if ($counsellor && ! $counsellor->is_active) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'email' => __('Your counsellor is inactive. Please contact the administrator.'),
                ]);
            }
        }

        // User login restriction
        if ($user && ! $user->is_active) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => __('Your account is inactive. Please contact the administrator.'),
            ]);
        }

        // Update last login time
        if ($user) {
            $user->last_login_at = now();
            $user->save();
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
