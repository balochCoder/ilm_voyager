<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\InstitutionController;
use Illuminate\Support\Facades\Route;

Route::get('institutions', [InstitutionController::class, 'index'])->name('institutions:index');
Route::get('institutions/create', [InstitutionController::class, 'create'])->name('institutions:create');
Route::post('institutions', [InstitutionController::class, 'store'])->name('institutions:store');
