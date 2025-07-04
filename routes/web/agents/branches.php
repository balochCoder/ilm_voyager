<?php

use Illuminate\Support\Facades\Route;

Route::get('branches', [\App\Http\Controllers\Tenants\BranchController::class, 'index'])->name('branches:index');
Route::get('branches/create', [\App\Http\Controllers\Tenants\BranchController::class, 'create'])->name('branches:create');
Route::post('branches', [\App\Http\Controllers\Tenants\BranchController::class, 'store'])->name('branches:store');
Route::patch('branches/{branch}/toggle-status', [\App\Http\Controllers\Tenants\BranchController::class, 'toggleStatus'])->name('branches:toggle-status');
