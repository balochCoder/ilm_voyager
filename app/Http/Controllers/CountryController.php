<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    public function index()
    {
        $countries = Country::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('agents/countries/index', [
            'countries' => $countries,
        ]);
    }
}
