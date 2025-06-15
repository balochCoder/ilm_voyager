<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Models\Country;

class CountryController extends Controller
{
    use InertiaRoute;
    public function index()
    {
        $countries = Country::where('is_active', true)
            ->orderBy('name')
            ->get();

        return $this->factory->render('agents/countries/index', [
            'countries' => $countries,
        ]);
    }
}
