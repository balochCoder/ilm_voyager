<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\Agent\LeadSourceController;
use Illuminate\Support\Facades\Route;

Route::get('lead-sources', [LeadSourceController::class, 'index'])->name('lead-sources:index');
Route::get('lead-sources/{leadSource}/edit', [LeadSourceController::class, 'edit'])->name('lead-sources:edit');
Route::put('lead-sources/{leadSource}', [LeadSourceController::class, 'update'])->name('lead-sources:update');
Route::delete('lead-sources/{leadSource}', [LeadSourceController::class, 'destroy'])->name('lead-sources:destroy');
Route::post('lead-sources/{id}/restore', [LeadSourceController::class, 'restore'])->name('lead-sources:restore');
Route::get('lead-sources/create', [LeadSourceController::class, 'create'])->name('lead-sources:create');
Route::post('lead-sources', [LeadSourceController::class, 'store'])->name('lead-sources:store');
Route::patch('lead-sources/{leadSource}/toggle-status', [LeadSourceController::class, 'toggleStatus'])->name('lead-sources:toggle-status');
