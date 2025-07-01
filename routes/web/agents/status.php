<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\StatusController;
use Illuminate\Support\Facades\Route;

Route::get('representing-countries/{repCountry}/reorder-statuses', [StatusController::class, 'reorderStatuses'])->name('rep-countries:reorder-statuses');

Route::post('representing-countries/{repCountry}/save-status-order', [StatusController::class, 'saveStatusOrder'])->name('rep-countries:save-status-order');

Route::post('representing-countries/{repCountry}/add-status', [StatusController::class, 'addStatus'])->name('rep-countries:add-status');

// RepCountryStatus routes
Route::patch('rep-country-status/{repCountryStatus}/toggle-status', [StatusController::class, 'toggleRepCountryStatus'])->name('rep-countries:toggle-rep-country-status');

Route::patch('rep-country-status/{repCountryStatus}/edit', [StatusController::class, 'editRepCountryStatus'])->name('rep-countries:edit-status'); 