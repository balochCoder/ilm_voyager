<?php

declare(strict_types=1);

use App\Http\Controllers\Tenants;
use Illuminate\Support\Facades\Route;

Route::get('countries', [Tenants\Agent\CountryController::class, 'index'])->name('countries:index');
