<?php

use App\Enums\TenantRolesEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::as('agents:')->middleware(['role:'.TenantRolesEnum::SUPERADMIN->value])->prefix('agents')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('agents/dashboard'))->name('dashboard');

    Route::group(
        [],
        base_path('routes/web/settings.php')
    );
});
