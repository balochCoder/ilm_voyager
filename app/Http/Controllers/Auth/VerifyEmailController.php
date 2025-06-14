<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

final class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return redirect()->intended(route('agents:dashboard', absolute:false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return redirect()->intended(route('counsellors:dashboard', absolute:false));
        }
        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
