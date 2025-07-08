<?php

use App\Http\Controllers\Tenants\BranchOffice\CounsellorRemarkController;
use App\Http\Controllers\Tenants\BranchOffice\CounsellorController;
use Illuminate\Support\Facades\Route;

Route::get('counsellors', [CounsellorController::class, 'index'])->name('counsellors:index');
Route::get('counsellors/create', [CounsellorController::class, 'create'])->name('counsellors:create');
Route::post('counsellors', [CounsellorController::class, 'store'])->name('counsellors:store');
Route::get('counsellors/{counsellor}/edit', [CounsellorController::class, 'edit'])->name('counsellors:edit');
Route::put('counsellors/{counsellor}', [CounsellorController::class, 'update'])->name('counsellors:update');
Route::patch('counsellors/{counsellor}/toggle-status', [CounsellorController::class, 'toggleStatus'])->name('counsellors:toggle-status');
// Remarks API
Route::get('counsellors/{counsellor}/remarks', [CounsellorRemarkController::class, 'index'])->name('counsellors:remarks:index');
Route::post('counsellors/{counsellor}/remarks', [CounsellorRemarkController::class, 'store'])->name('counsellors:remarks:store');
Route::put('counsellors/{counsellor}/remarks/{remark}', [CounsellorRemarkController::class, 'update'])->name('counsellors:remarks:update');
Route::get('counsellors/{counsellor}/assign-institutions', [CounsellorController::class, 'assignInstitutions'])->name('counsellors:assign-institutions');
Route::post('counsellors/{counsellor}/assign-institutions', [CounsellorController::class, 'storeInstitutionAssignments'])->name('counsellors:assign-institutions-store');
