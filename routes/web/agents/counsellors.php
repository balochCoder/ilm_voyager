<?php

use Illuminate\Support\Facades\Route;

Route::get('counsellors', [\App\Http\Controllers\Tenants\CounsellorController::class, 'index'])->name('counsellors:index');
Route::get('counsellors/create', [\App\Http\Controllers\Tenants\CounsellorController::class, 'create'])->name('counsellors:create');
Route::post('counsellors', [\App\Http\Controllers\Tenants\CounsellorController::class, 'store'])->name('counsellors:store');
Route::patch('counsellors/{counsellor}/toggle-status', [\App\Http\Controllers\Tenants\CounsellorController::class, 'toggleStatus'])->name('counsellors:toggle-status');
Route::get('counsellors/{counsellor}/edit', [\App\Http\Controllers\Tenants\CounsellorController::class, 'edit'])->name('counsellors:edit');
Route::put('counsellors/{counsellor}', [\App\Http\Controllers\Tenants\CounsellorController::class, 'update'])->name('counsellors:update');
Route::get('counsellors/{counsellor}/assign-institutions', [\App\Http\Controllers\Tenants\CounsellorController::class, 'assignInstitutions'])->name('counsellors:assign-institutions');
Route::post('counsellors/{counsellor}/assign-institutions', [\App\Http\Controllers\Tenants\CounsellorController::class, 'storeInstitutionAssignments'])->name('counsellors:assign-institutions-store');

// Counsellor Remarks Routes
Route::get('counsellors/{counsellor}/remarks', [\App\Http\Controllers\Tenants\CounsellorRemarkController::class, 'index'])->name('counsellors:remarks:index');
Route::post('counsellors/{counsellor}/remarks', [\App\Http\Controllers\Tenants\CounsellorRemarkController::class, 'store'])->name('counsellors:remarks:store');
Route::put('counsellors/{counsellor}/remarks/{remark}', [\App\Http\Controllers\Tenants\CounsellorRemarkController::class, 'update'])->name('counsellors:remarks:update');

// Counsellor Targets Routes
Route::get('counsellors/{counsellor}/targets', [\App\Http\Controllers\Tenants\CounsellorTargetController::class, 'index'])->name('counsellors:targets:index');
Route::post('counsellors/{counsellor}/targets', [\App\Http\Controllers\Tenants\CounsellorTargetController::class, 'store'])->name('counsellors:targets:store');
Route::put('counsellors/{counsellor}/targets/{target}', [\App\Http\Controllers\Tenants\CounsellorTargetController::class, 'update'])->name('counsellors:targets:update');
