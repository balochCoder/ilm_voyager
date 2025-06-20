<?php

use App\Http\Controllers\Tenants;
use Illuminate\Support\Facades\Route;

Route::get('countries', [Tenants\CountryController::class, 'index'])->name('countries:index');  
