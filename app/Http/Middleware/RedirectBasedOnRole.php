<?php

namespace App\Http\Middleware;

use App\Enums\TenantRolesEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();

        // If user is already on their dashboard, proceed
        if ($this->isOnCorrectDashboard($user, $request->path())) {
            return $next($request);
        }

        // Redirect based on role
        if ($user->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return redirect()->route('agents:dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::COUNSELLOR->value)) {
            return redirect()->route('counsellors:dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::BRANCHOFFICE->value)) {
            return redirect()->route('branches:dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::PROCESSINGOFFICE->value)) {
            return redirect()->route('processing-offices:dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::FRONTOFFICE->value)) {
            return redirect()->route('front-offices:dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::ASSOCIATE->value)) {
            return redirect()->route('associates:dashboard');
        }

        return $next($request);
    }

    /**
     * Check if user is already on their correct dashboard
     */
    private function isOnCorrectDashboard($user, string $path): bool
    {
        if ($user->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return str_starts_with($path, 'agents/dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::COUNSELLOR->value)) {
            return str_starts_with($path, 'counsellors/dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::BRANCHOFFICE->value)) {
            return str_starts_with($path, 'branches/dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::PROCESSINGOFFICE->value)) {
            return str_starts_with($path, 'processing-offices/dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::FRONTOFFICE->value)) {
            return str_starts_with($path, 'front-offices/dashboard');
        }

        if ($user->hasRole(TenantRolesEnum::ASSOCIATE->value)) {
            return str_starts_with($path, 'associates/dashboard');
        }

        return false;
    }
}
