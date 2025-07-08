<?php

declare(strict_types=1);

use App\Enums\TenantRolesEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::as('agents:')->middleware(['role:'.TenantRolesEnum::SUPERADMIN->value])->prefix('agents')->group(function () {
    Route::get('dashboard', fn () => Inertia::render('agents/dashboard'))->name('dashboard');

    Route::group(
        [],
        base_path('routes/web/settings.php')
    );

    Route::group(
        [],
        base_path('routes/web/agents/countries.php')
    );

    Route::group(
        [],
        base_path('routes/web/agents/rep-countries.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/status.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/substatus.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/institutions.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/branches.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/counsellors.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/processing-offices.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/associates.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/courses.php')
    );
    Route::group(
        [],
        base_path('routes/web/agents/lead-sources.php')
    );
});
