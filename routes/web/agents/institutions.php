<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\InstitutionController;
use Illuminate\Support\Facades\Route;

Route::get('representing-institutions', [InstitutionController::class, 'index'])->name('institutions:index');
Route::get('representing-institutions/create', [InstitutionController::class, 'create'])->name('institutions:create');
Route::post('representing-institutions', [InstitutionController::class, 'store'])->name('institutions:store');
Route::patch('representing-institutions/{institution}/toggle-status', [InstitutionController::class, 'toggleStatus'])->name('institutions:toggle-status');
