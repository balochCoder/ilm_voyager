<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
    |--------------------------------------------------------------------------
    | Tenant Routes
    |--------------------------------------------------------------------------
    |
    | Here you can register the tenant routes for your application.
    | These routes are loaded by the TenantRouteServiceProvider.
    |
    | Feel free to customize them however you want. Good luck!
    |
    */

Route::middleware([
    'web',
    'tenant.approval',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    Route::get('/', function () {
        return to_route('login');
    });

    Route::group(
        [],
        base_path('routes/web/auth.php')
    );

    Route::middleware(['auth', 'verified'])->group(function (): void {
        Route::get('/', function () {
            return view('welcome');
        })->middleware('tenant.redirect');
        Route::group([], base_path('routes/web/agents/routes.php'));
        Route::group([], base_path('routes/web/counsellors/routes.php'));
        Route::group([], base_path('routes/web/branches/routes.php'));
    });
});
