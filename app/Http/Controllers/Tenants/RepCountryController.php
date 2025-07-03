<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\RepCountry\StoreRepCountryAction;
use App\Actions\RepCountry\StoreRepCountryNotesAction;
use App\Actions\RepCountry\ToggleStatusAction;
use App\Actions\RepCountry\GetRepCountriesIndexDataAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\RepCountry\StoreRepCountryNotesRequest;
use App\Http\Requests\RepCountry\StoreRepCountryRequest;
use App\Http\Requests\RepCountry\ToggleStatusRequest;
use App\Http\Resources\CountryResource;
use App\Models\Country;
use App\Models\RepCountry;
use App\Models\Status;
use Illuminate\Http\Request;

final class RepCountryController extends Controller
{
    use InertiaRoute;

    public function index(Request $request, GetRepCountriesIndexDataAction $action)
    {
        $data = $action->execute($request);
        return $this->factory->render('agents/rep-countries/index', $data);
    }

    public function create()
    {

        $countries = Country::where('is_active', true)
            ->whereDoesntHave('repCountry')
            ->orderBy('name')
            ->get();
        $statuses = Status::ordered()->get(['id', 'name']);

        return $this->factory->render('agents/rep-countries/create', [
            'countries' => CountryResource::collection($countries),
            'statuses' => $statuses,
        ]);
    }

    public function store(StoreRepCountryRequest $request, StoreRepCountryAction $action)
    {
        $action->execute($request);

        return to_route('agents:rep-countries:index')
            ->with('success', 'Representing Country created successfully.');
    }

    public function toggleStatus(ToggleStatusRequest $request, RepCountry $repCountry, ToggleStatusAction $action)
    {

        $action->execute($repCountry, $request);

        return back()
            ->with('success', 'Representing Country Status updated successfully.');
    }

    public function addNotes(RepCountry $repCountry)
    {
        $repCountry->load(['country', 'repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc')->with(['subStatuses' => function ($subQuery) {
                $subQuery->orderBy('order', 'asc');
            }]);
        }]);

        return $this->factory->render('agents/rep-countries/add-notes', [
            'repCountry' => $repCountry,
            'statuses' => $repCountry->repCountryStatuses,
        ]);
    }

    public function storeNotes(StoreRepCountryNotesRequest $request, RepCountry $repCountry, StoreRepCountryNotesAction $action)
    {
        $action->execute($request, $repCountry);

        return back()->with('success', 'Notes updated successfully.');
    }
}
