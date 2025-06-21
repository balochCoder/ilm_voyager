<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Models\RepCountry;
use App\Models\Country;
use App\Http\Resources\RepCountryResource;
use App\Http\Resources\CountryResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RepCountryController extends Controller
{
    use InertiaRoute;

    public function index(Request $request)
    {
        $repCountries = RepCountry::with('country')
            ->orderBy('created_at', 'desc')
            ->paginate(4);

        return $this->factory->render('agents/rep-countries/index', [
            'repCountries' => RepCountryResource::collection($repCountries)->resolve(),
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

        return $this->factory->render('agents/rep-countries/create', [
            'countries' => CountryResource::collection($countries)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'monthly_living_cost' => 'nullable|string|max:255',
            'visa_requirements' => 'nullable|string',
            'part_time_work_details' => 'nullable|string',
            'country_benefits' => 'nullable|string',
            'is_active' => 'boolean',
            'country_id' => [
                'required',
                'exists:countries,id',
                Rule::unique('rep_countries', 'country_id'),
            ],
        ]);

        RepCountry::create($validated);

        return redirect()->route('agents:rep-countries:index')
            ->with('success', 'Rep Country created successfully.');
    }
    public function toggleStatus(Request $request, $id)
    {
        $repCountry = RepCountry::findOrFail($id);
        $repCountry->update(['is_active' => $request->is_active]);

        return redirect()->route('agents:rep-countries:index')->with('success' , 'Status updated successfully.');
    }
}
