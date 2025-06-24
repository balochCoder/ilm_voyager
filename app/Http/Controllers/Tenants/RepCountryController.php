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
        $query = RepCountry::with(['country', 'statuses' => function ($query) {
            $query->orderBy('rep_country_status.order', 'asc');
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

    public function addNotes(RepCountry $repCountry)
    {
        $repCountry->load('statuses');
        return $this->factory->render('agents/rep-countries/add-notes', [
            'repCountry' => $repCountry,
            'statuses' => $repCountry->statuses,
        ]);
    }

    public function storeNotes(Request $request, RepCountry $repCountry)
    {
        $notes = $request->input('status_notes', []);
        foreach ($notes as $statusId => $note) {
            $repCountry->statuses()->updateExistingPivot($statusId, ['notes' => $note]);
        }
        return redirect()->back()->with('success', 'Notes updated successfully.');
    }

    public function reorderStatuses(RepCountry $repCountry)
    {
        $repCountry->load(['country', 'statuses' => function ($query) {
            $query->orderBy('rep_country_status.order', 'asc');
        }]);

        return $this->factory->render('agents/rep-countries/reorder-statuses', [
            'repCountry' => RepCountryResource::make($repCountry)->resolve(),
        ]);
    }

    public function saveStatusOrder(Request $request, RepCountry $repCountry)
    {
        $request->validate([
            'status_order' => 'required|array',
            'status_order.*.status_id' => 'required|string|exists:statuses,id',
            'status_order.*.order' => 'required|integer|min:1',
        ]);

        $statusOrder = $request->input('status_order', []);

        // Get the ID of the 'New' status
        $newStatusId = \App\Models\Status::where('name', 'New')->value('id');

        foreach ($statusOrder as $item) {
            // Skip updating order for 'New'
            if ($item['status_id'] == $newStatusId) {
                continue;
            }
            $repCountry->statuses()->updateExistingPivot($item['status_id'], [
                'order' => $item['order']
            ]);
        }

        return redirect()->back()
            ->with('success', 'Status order updated successfully.');

    }

    public function addStatus(Request $request, RepCountry $repCountry)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Check if status already exists (case-insensitive)
        $status = \App\Models\Status::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();
        if (!$status) {
            $status = \App\Models\Status::create([
                'name' => $request->name,
                'color' => 'gray',
                'order' => \App\Models\Status::max('order') + 1,
            ]);
        }

        // Attach to repCountry if not already attached
        $alreadyAttached = $repCountry->statuses()->where('statuses.id', $status->id)->exists();
        if (!$alreadyAttached) {
            $maxOrder = $repCountry->statuses()->max('rep_country_status.order') ?? 0;
            $repCountry->statuses()->attach($status->id, ['order' => $maxOrder + 1]);
        }

        // Reload the status with pivot
        $newStatus = $repCountry->statuses()->where('statuses.id', $status->id)->first();
        return redirect()->back()->with('newStatus', (new \App\Http\Resources\StatusResource($newStatus))->resolve());
    }
}
