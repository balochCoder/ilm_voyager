<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Models\RepCountry;
use App\Models\Country;
use App\Http\Resources\RepCountryResource;
use App\Http\Resources\CountryResource;
use App\Http\Requests\RepCountry\StoreRepCountryRequest;
use App\Http\Requests\RepCountry\ToggleStatusRequest;
use App\Actions\RepCountry\StoreRepCountryAction;
use App\Actions\RepCountry\ToggleStatusAction;
use App\Models\Status;
use Illuminate\Http\Request;

class RepCountryController extends Controller
{
    use InertiaRoute;

    public function index(Request $request)
    {
        $query = RepCountry::with(['country', 'statuses'])->orderBy('created_at', 'desc');


        if ($request->filled('country_id') && $request->country_id !== 'all') {
            $query->where('country_id', $request->country_id);
        }

        $repCountries = $query->paginate(10);

        $availableCountries = Country::whereHas('repCountry')
            ->orderBy('name')
            ->get(['id', 'name', 'flag']);

        $statuses = Status::ordered()->get();

        return $this->factory->render('agents/rep-countries/index', [
            'repCountries' => RepCountryResource::collection($repCountries)->resolve(),
            'availableCountries' => $availableCountries,
            'statuses' => $statuses,
            'pagination' => [
                'current_page' => $repCountries->currentPage(),
                'last_page' => $repCountries->lastPage(),
                'per_page' => $repCountries->perPage(),
                'total' => $repCountries->total(),
                'from' => $repCountries->firstItem(),
                'to' => $repCountries->lastItem(),
                'has_more_pages' => $repCountries->hasMorePages(),
                'has_previous_page' => $repCountries->onFirstPage(),
            ],
        ]);
    }

    public function create()
    {
        $countries = Country::where('is_active', true)
            ->whereDoesntHave('repCountry')
            ->orderBy('name')
            ->get();
        $statuses = Status::ordered()->get(['id', 'name']);
        return $this->factory->render('agents/rep-countries/create', [
            'countries' => CountryResource::collection($countries)->resolve(),
            'statuses' => $statuses,
        ]);
    }

    public function store(StoreRepCountryRequest $request, StoreRepCountryAction $action)
    {
        $action->execute($request);

        return redirect()->route('agents:rep-countries:index')
            ->with('success', 'Representing Country created successfully.');
    }

    public function toggleStatus(ToggleStatusRequest $request, RepCountry $repCountry, ToggleStatusAction $action)
    {

        $action->execute($repCountry, $request);

        return redirect()->route('agents:rep-countries:index')
            ->with('success', 'Status updated successfully.');
    }
}
