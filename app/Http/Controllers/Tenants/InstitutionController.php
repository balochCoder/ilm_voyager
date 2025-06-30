<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\StoreInstitutionAction;
use App\Actions\ToggleInstitutionStatusAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Http\Resources\InstitutionResource;
use App\Models\Currency;
use App\Models\Institution;
use App\Models\RepCountry;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class InstitutionController extends Controller
{
    use InertiaRoute;
    public function index()
    {
        $query = Institution::with(['repCountry.country', 'currency'])->orderByDesc('created_at');

        // Add filters if needed (e.g., country_id, type)
        if (request()->filled('country_id') && request('country_id') !== 'all') {
            $query->whereHas('repCountry', function ($q) {
                $q->where('country_id', request('country_id'));
            });
        }
        if (request()->filled('type') && request('type') !== 'all') {
            $query->where('institute_type', request('type'));
        }
        // New filters
        if (request()->filled('institution_name')) {
            $query->where('institution_name', 'like', '%' . request('institution_name') . '%');
        }
        if (request()->filled('contact_person_email')) {
            $query->where('contact_person_email', 'like', '%' . request('contact_person_email') . '%');
        }
        if (request()->filled('keyword')) {
            $q = request('keyword');
            $query->where(function ($sub) use ($q) {
                $sub->where('institution_name', 'like', "%$q%")
                    ->orWhere('contact_person_email', 'like', "%$q%")
                    ->orWhere('contact_person_name', 'like', "%$q%")
                ;
            });
        }
        if (request()->filled('contract_expiry_start')) {
            $query->whereDate('contract_expiry_date', '>=', request('contract_expiry_start'));
        }
        if (request()->filled('contract_expiry_end')) {
            $query->whereDate('contract_expiry_date', '<=', request('contract_expiry_end'));
        }

        $institutions = InstitutionResource::collection($query->paginate(4));

        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $currencies = Currency::orderBy('name')->get();

        return $this->factory->render('agents/institutions/index', [
            'institutions' => $institutions,
            'repCountries' => $repCountries,
            'currencies' => $currencies,
            'pagination' => [
                'current_page' => $institutions->currentPage(),
                'last_page' => $institutions->lastPage(),
                'per_page' => $institutions->perPage(),
                'total' => $institutions->total(),
                'from' => $institutions->firstItem(),
                'to' => $institutions->lastItem(),
                'has_more_pages' => $institutions->hasMorePages(),
                'has_previous_page' => !$institutions->onFirstPage(),
            ],
        ]);
    }

    public function create(): Response
    {
        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $currencies = Currency::orderBy('name')->get();
        return $this->factory->render('agents/institutions/create', [
            'repCountries' => $repCountries,
            'currencies' => $currencies,
        ]);
    }

    public function store(StoreInstitutionRequest $request, StoreInstitutionAction $action): RedirectResponse
    {
        $action->execute($request);
        return redirect()->route('agents:institutions:index')->with('success', 'Institution created successfully.');
    }

    public function toggleStatus(Institution $institution, ToggleInstitutionStatusAction $action): RedirectResponse
    {
        $institution = $action->execute($institution);
        return redirect()->back()->with('success', 'Institution status updated successfully.');
    }
}
