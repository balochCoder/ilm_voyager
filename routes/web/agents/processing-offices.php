<?php

use Illuminate\Support\Facades\Route;

Route::get('processing-offices', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'index'])->name('processing-offices:index');
Route::get('processing-offices/create', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'create'])->name('processing-offices:create');
Route::post('processing-offices', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'store'])->name('processing-offices:store');
Route::patch('processing-offices/{processingOffice}/toggle-status', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'toggleStatus'])->name('processing-offices:toggle-status');
Route::get('processing-offices/{processingOffice}/edit', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'edit'])->name('processing-offices:edit');
Route::put('processing-offices/{processingOffice}', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'update'])->name('processing-offices:update');
Route::get('processing-offices/{processingOffice}/assign-institutions', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'assignInstitutions'])->name('processing-offices:assign-institutions');
Route::post('processing-offices/{processingOffice}/assign-institutions', [\App\Http\Controllers\Tenants\ProcessingOfficeController::class, 'storeInstitutionAssignments'])->name('processing-offices:assign-institutions-store');
