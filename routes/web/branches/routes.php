<?php

declare(strict_types=1);

use App\Enums\TenantRolesEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::as('branches:')->middleware(['role:' . TenantRolesEnum::BRANCHOFFICE->value])->prefix('branch-office')->group(function () {
    Route::get('dashboard', fn() => Inertia::render('branches/dashboard'))->name('dashboard');

    Route::group(
        [],
        base_path('routes/web/settings.php')
    );
    Route::group(
        [],
        base_path('routes/web/branches/counsellors.php')
    );
    Route::group(
        [],
        base_path('routes/web/branches/associates.php')
    );
});
