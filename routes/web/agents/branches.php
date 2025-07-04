<?php

use Illuminate\Support\Facades\Route;

Route::get('branches/create', [\App\Http\Controllers\Tenants\BranchController::class, 'create'])->name('branches:create');
Route::post('branches', [\App\Http\Controllers\Tenants\BranchController::class, 'store'])->name('branches:store');
