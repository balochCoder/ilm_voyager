<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantApproval
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenancy()->tenant;

        if (!$tenant || !$tenant->is_approved) {
            abort(403, 'Tenant is not approved.');
        }
        return $next($request);
    }
}
