<?php

use App\Http\Controllers\Tenants\BranchOffice\AssociateController;
use Illuminate\Support\Facades\Route;

Route::get('associates', [AssociateController::class, 'index'])->name('associates:index');
Route::get('associates/create', [AssociateController::class, 'create'])->name('associates:create');
Route::post('associates', [AssociateController::class, 'store'])->name('associates:store');
Route::get('associates/{associate}/edit', [AssociateController::class, 'edit'])->name('associates:edit');
Route::put('associates/{associate}', [AssociateController::class, 'update'])->name('associates:update');
Route::patch('associates/{associate}/toggle-status', [AssociateController::class, 'toggleStatus'])->name('associates:toggle-status');
Route::get('associates/{associate}', [AssociateController::class, 'show'])->name('associates:show');
