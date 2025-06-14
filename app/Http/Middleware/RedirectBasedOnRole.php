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
            return redirect()->route('counsellor:dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::BRANCHOFFICE->value)) {
            return redirect()->route('branch:dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::PROCESSINGOFFICE->value)) {
            return redirect()->route('processing:dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::FRONTOFFICE->value)) {
            return redirect()->route('front:dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::ASSOCIATE->value)) {
            return redirect()->route('associate:dashboard');
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
            return str_starts_with($path, 'counsellor/dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::BRANCHOFFICE->value)) {
            return str_starts_with($path, 'branch/dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::PROCESSINGOFFICE->value)) {
            return str_starts_with($path, 'processing/dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::FRONTOFFICE->value)) {
            return str_starts_with($path, 'front/dashboard');
        }
        
        if ($user->hasRole(TenantRolesEnum::ASSOCIATE->value)) {
            return str_starts_with($path, 'associate/dashboard');
        }

        return false;
    }
} 