<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
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
