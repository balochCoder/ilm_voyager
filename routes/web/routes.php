<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        // your actual routes

        Route::get('/', fn() => Inertia::render('welcome'))->name('home');
        Route::middleware('guest')->group(function (): void {
            Route::get('register', [RegisteredUserController::class, 'create'])
                ->name('register');

            Route::post('register', [RegisteredUserController::class, 'store']);
        });
    });
}
