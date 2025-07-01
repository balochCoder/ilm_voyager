<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\SubStatusController;
use Illuminate\Support\Facades\Route;

// Sub-status routes
Route::post('rep-country-status/{repCountryStatus}/add-sub-status', [SubStatusController::class, 'addSubStatus'])->name('rep-countries:add-sub-status');

Route::patch('sub-status/{subStatus}/toggle-status', [SubStatusController::class, 'toggleSubStatus'])->name('rep-countries:toggle-sub-status');

Route::patch('sub-status/{subStatus}/edit', [SubStatusController::class, 'editSubStatus'])->name('rep-countries:edit-sub-status'); 