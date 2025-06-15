<?php

use App\Enums\TenantRolesEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::as('counsellors:')->middleware(['role:' . TenantRolesEnum::COUNSELLOR->value])->prefix('counsellors')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('counsellors/dashboard'))->name('dashboard');

    Route::group(
        [],
        base_path('routes/web/settings.php')
    );
});
