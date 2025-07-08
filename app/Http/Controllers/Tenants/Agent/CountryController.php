<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants\Agent;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Resources\CountryResource;
use App\Models\Country;

final class CountryController extends Controller
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
