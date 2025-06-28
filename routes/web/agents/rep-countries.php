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

Route::get('representing-countries/{repCountry}/reorder-statuses', [Tenants\RepCountryController::class, 'reorderStatuses'])->name('rep-countries:reorder-statuses');

Route::post('representing-countries/{repCountry}/save-status-order', [Tenants\RepCountryController::class, 'saveStatusOrder'])->name('rep-countries:save-status-order');

Route::post('representing-countries/{repCountry}/add-status', [Tenants\RepCountryController::class, 'addStatus'])->name('rep-countries:add-status');

// RepCountryStatus routes
Route::patch('rep-country-status/{repCountryStatus}/toggle-status', [Tenants\RepCountryController::class, 'toggleRepCountryStatus'])->name('rep-countries:toggle-rep-country-status');

Route::patch('rep-country-status/{repCountryStatus}/edit', [Tenants\RepCountryController::class, 'editRepCountryStatus'])->name('rep-countries:edit-status');

// Sub-status routes
Route::post('rep-country-status/{repCountryStatus}/add-sub-status', [Tenants\RepCountryController::class, 'addSubStatus'])->name('rep-countries:add-sub-status');

Route::patch('sub-status/{subStatus}/toggle-status', [Tenants\RepCountryController::class, 'toggleSubStatus'])->name('rep-countries:toggle-sub-status');

Route::patch('sub-status/{subStatus}/edit', [Tenants\RepCountryController::class, 'editSubStatus'])->name('rep-countries:edit-sub-status');
