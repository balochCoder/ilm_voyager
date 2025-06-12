<?php

use App\Http\Controllers\CountryController;
use Illuminate\Support\Facades\Route;

Route::get('countries', [CountryController::class, 'index'])->name('countries:index');
