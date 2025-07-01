<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenants;

use App\Actions\Institution\StoreInstitutionAction;
use App\Actions\Institution\ToggleInstitutionStatusAction;
use App\Actions\Institution\GetInstitutionsIndexDataAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Models\Currency;
use App\Models\Institution;
use App\Models\RepCountry;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class InstitutionController extends Controller
{
    use InertiaRoute;
    public function index(GetInstitutionsIndexDataAction $action)
    {
        $data = $action->execute(request());
        return $this->factory->render('agents/institutions/index', $data);
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

    public function show(Institution $institution): Response
    {
        $institution->load(['repCountry','repCountry.country', 'currency']);
        return $this->factory->render('agents/institutions/show', [
            'institution' => new \App\Http\Resources\InstitutionResource($institution),
        ]);
    }

    public function edit(Institution $institution): Response
    {
        $institution->load(['repCountry', 'repCountry.country', 'currency']);
        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $currencies = Currency::orderBy('name')->get();
        return $this->factory->render('agents/institutions/edit', [
            'institution' => new \App\Http\Resources\InstitutionResource($institution),
            'repCountries' => $repCountries,
            'currencies' => $currencies,
        ]);
    }

    public function update(StoreInstitutionRequest $request, Institution $institution, StoreInstitutionAction $action): RedirectResponse
    {
        $action->execute($request, $institution);
        return redirect()->route('agents:institutions:show', $institution)->with('success', 'Institution updated successfully.');
    }
}
