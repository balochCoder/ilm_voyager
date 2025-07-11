<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

final class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),

        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return $this->redirectToDashboard();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function redirectToDashboard()
    {
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

        Auth::logout();
    }
}
