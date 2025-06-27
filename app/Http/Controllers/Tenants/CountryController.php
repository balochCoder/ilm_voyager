<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Http\Resources\CountryResource;

class CountryController extends Controller
{
    use InertiaRoute;

    public function index()
    {
        $countries = Country::query()
            ->orderBy('name')
            ->get();

        return $this->factory->render('agents/countries/index', [
            'countries' => CountryResource::collection($countries)->resolve(),
        ]);
    }
}
