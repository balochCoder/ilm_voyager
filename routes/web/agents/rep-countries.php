<?php

use App\Http\Controllers\Tenants;
use Illuminate\Support\Facades\Route;

// Route::resource('representing-countries', Tenants\RepCountryController::class)
//     ->names('rep-countries');


Route::get('representing-countries', [Tenants\RepCountryController::class, 'index'])
    ->name('rep-countries:index');

Route::get('representing-countries/create', [Tenants\RepCountryController::class, 'create'])
    ->name('rep-countries:create');

Route::post('representing-countries', [Tenants\RepCountryController::class, 'store'])
    ->name('rep-countries:store');

Route::patch('rep-countries/{repCountry}/toggle-status', [Tenants\RepCountryController::class, 'toggleStatus'])->name('rep-countries:toggle-status');

Route::get('rep-countries/{repCountry}/add-notes', [Tenants\RepCountryController::class, 'addNotes'])->name('rep-countries:add-notes');

Route::post('rep-countries/{repCountry}/add-notes', [Tenants\RepCountryController::class, 'storeNotes'])->name('rep-countries:store-notes');
