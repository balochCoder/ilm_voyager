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
use App\Actions\RepCountry\StoreRepCountryNotesAction;
use App\Actions\RepCountry\SaveRepCountryStatusOrderAction;
use App\Actions\RepCountry\AddRepCountryStatusAction;
use App\Http\Requests\RepCountry\StoreRepCountryNotesRequest;
use App\Http\Requests\RepCountry\SaveRepCountryStatusOrderRequest;
use App\Http\Requests\RepCountry\AddRepCountryStatusRequest;

class RepCountryController extends Controller
{
    use InertiaRoute;

    public function index(Request $request)
    {
        // Always eager load relationships to prevent N+1 queries
        $query = RepCountry::with(['country', 'repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc');
        }])->orderBy('created_at', 'desc');

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
            'countries' => CountryResource::collection($countries),
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

    public function addNotes(RepCountry $repCountry)
    {
        $repCountry->load(['repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc');
        }]);
        return $this->factory->render('agents/rep-countries/add-notes', [
            'repCountry' => $repCountry,
            'statuses' => $repCountry->statuses,
        ]);
    }

    public function storeNotes(StoreRepCountryNotesRequest $request, RepCountry $repCountry, StoreRepCountryNotesAction $action)
    {
        $action->execute($request, $repCountry);
        return redirect()->back()->with('success', 'Notes updated successfully.');
    }

    public function reorderStatuses(RepCountry $repCountry)
    {
        $repCountry->load(['country', 'repCountryStatuses' => function ($query) {
            $query->orderBy('order', 'asc');
        }]);

        return $this->factory->render('agents/rep-countries/reorder-statuses', [
            'repCountry' => RepCountryResource::make($repCountry)->resolve(),
        ]);
    }

    public function saveStatusOrder(SaveRepCountryStatusOrderRequest $request, RepCountry $repCountry, SaveRepCountryStatusOrderAction $action)
    {
        $action->execute($request, $repCountry);
        return redirect()->back()->with('success', 'Status order updated successfully.');
    }

    public function addStatus(AddRepCountryStatusRequest $request, RepCountry $repCountry, AddRepCountryStatusAction $action)
    {
        $action->execute($request, $repCountry);
        $newStatus = $repCountry->repCountryStatuses()->where('status_name', $request->name)->first();
        return redirect()->back()->with('newStatus', $newStatus);
    }
}
