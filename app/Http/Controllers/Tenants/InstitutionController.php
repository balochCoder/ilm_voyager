<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\StoreInstitutionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Models\Currency;
use App\Models\Institution;
use App\Models\RepCountry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionController extends Controller
{
    public function index(): Response
    {

        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $institutions = Institution::with('repCountry.country')->orderByDesc('created_at')->paginate(15);
        $currencies = Currency::orderBy('name')->get();
        return Inertia::render('agents/institutions/index', [
            'institutions' => $institutions,
             'repCountries' => $repCountries,
            'currencies' => $currencies,

        ]);
    }

    public function create(): Response
    {
        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $currencies = Currency::orderBy('name')->get();
        return Inertia::render('agents/institutions/create', [
            'repCountries' => $repCountries,
            'currencies' => $currencies,
        ]);
    }

    public function store(StoreInstitutionRequest $request, StoreInstitutionAction $action): RedirectResponse
    {
        $action->execute($request);
        return redirect()->route('agents:institutions:index')->with('success', 'Institution created successfully.');
    }
}
