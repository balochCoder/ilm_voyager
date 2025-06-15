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
            return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return redirect()->intended(route('agents:dashboard', absolute: false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::COUNSELLOR->value)) {
            return redirect()->intended(route('agents:dashboard', absolute: false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::BRANCHOFFICE->value)) {
            return redirect()->intended(route('branches:dashboard', absolute: false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::FRONTOFFICE->value)) {
            return redirect()->intended(route('front-offices:dashboard', absolute: false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::ASSOCIATE->value)) {
            return redirect()->intended(route('associates:dashboard', absolute: false));
        }
        if (auth()->user()->hasRole(TenantRolesEnum::PROCESSINGOFFICE->value)) {
            return redirect()->intended(route('processing-offices:dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
    }
}
