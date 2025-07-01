<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants;
use Illuminate\Support\Facades\Route;

Route::get('representing-countries', [Tenants\RepCountryController::class, 'index'])
    ->name('rep-countries:index');

Route::get('representing-countries/create', [Tenants\RepCountryController::class, 'create'])
    ->name('rep-countries:create');

Route::post('representing-countries', [Tenants\RepCountryController::class, 'store'])
    ->name('rep-countries:store');

Route::patch('representing-countries/{repCountry}/toggle-status', [Tenants\RepCountryController::class, 'toggleStatus'])->name('rep-countries:toggle-status');

Route::get('representing-countries/{repCountry}/add-notes', [Tenants\RepCountryController::class, 'addNotes'])->name('rep-countries:add-notes');

Route::post('representing-countries/{repCountry}/add-notes', [Tenants\RepCountryController::class, 'storeNotes'])->name('rep-countries:store-notes');
