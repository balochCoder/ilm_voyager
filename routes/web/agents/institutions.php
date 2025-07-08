<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\Agent\CourseController;
use App\Http\Controllers\Tenants\Agent\InstitutionController;
use Illuminate\Support\Facades\Route;

Route::get('representing-institutions', [InstitutionController::class, 'index'])->name('institutions:index');
Route::get('representing-institutions/create', [InstitutionController::class, 'create'])->name('institutions:create');
Route::post('representing-institutions', [InstitutionController::class, 'store'])->name('institutions:store');
Route::patch('representing-institutions/{institution}/toggle-status', [InstitutionController::class, 'toggleStatus'])->name('institutions:toggle-status');
Route::get('representing-institutions/{institution}', [InstitutionController::class, 'show'])->name('institutions:show');
Route::get('representing-institutions/{institution}/edit', [
    \App\Http\Controllers\Tenants\Agent\InstitutionController::class,
    'edit',
])->name('institutions:edit');

Route::put('representing-institutions/{institution}', [
    \App\Http\Controllers\Tenants\Agent\InstitutionController::class,
    'update',
])->name('institutions:update');

// Course routes for an institution
Route::prefix('representing-institutions/{institution}')->group(function () {
    Route::get('courses', [CourseController::class, 'index'])->name('institutions:courses:index');
    Route::get('courses/create', [CourseController::class, 'create'])->name('institutions:courses:create');
    Route::post('courses', [CourseController::class, 'store'])->name('institutions:courses:store');
    Route::get('courses/{course}/edit', [CourseController::class, 'edit'])->name('institutions:courses:edit');
    Route::put('courses/{course}', [CourseController::class, 'update'])->name('institutions:courses:update');
    Route::patch('courses/{course}/toggle-status', [CourseController::class, 'toggleStatus'])->name('institutions:courses:toggle-status');
});
