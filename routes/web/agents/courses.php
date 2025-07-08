<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants\Agent\GlobalCourseController;
use Illuminate\Support\Facades\Route;

Route::get('find-courses', [GlobalCourseController::class, 'index'])->name('courses:index');
