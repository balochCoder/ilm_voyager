<?php

namespace App\Http\Controllers\Tenants;

use App\Actions\ProcessingOffice\IndexProcessingOfficeAction;
use App\Actions\ProcessingOffice\StoreProcessingOfficeAction;
use App\Actions\ProcessingOffice\UpdateProcessingOfficeAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessingOffice\StoreProcessingOfficeRequest;
use App\Http\Requests\ProcessingOffice\UpdateProcessingOfficeRequest;
use App\Http\Resources\ProcessingOfficeResource;
use App\Models\ProcessingOffice;
use App\Models\Country;
use App\Models\TimeZone;
use Illuminate\Http\Request;

class ProcessingOfficeController extends Controller
{
    use InertiaRoute;

    public function create()
    {
        $timeZones = TimeZone::query()->orderBy('label')->get(['id', 'label']);
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return $this->factory->render('agents/processing-offices/create', [
            'timeZones' => $timeZones,
            'countries' => $countries,
        ]);
    }

    public function store(StoreProcessingOfficeRequest $request, StoreProcessingOfficeAction $action)
    {
        try {
            $action->execute($request);

            return to_route('agents:processing-offices:index')->with('success', 'Processing Office and user created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create processing office and user: '.$e->getMessage()]);
        }
    }

    public function index(Request $request, IndexProcessingOfficeAction $action)
    {
        $data = $action->execute($request);

        return $this->factory->render('agents/processing-offices/index', $data);
    }

    public function toggleStatus(Request $request, ProcessingOffice $processingOffice)
    {
        $processingOffice->is_active = ! $processingOffice->is_active;
        $processingOffice->save();
        // Update all users of this processing office
        if ($processingOffice->user) {
            $processingOffice->user->is_active = $processingOffice->is_active;
            $processingOffice->user->save();
        }

        return back()->with('success', 'Processing Office status updated successfully.');
    }

    public function edit(ProcessingOffice $processingOffice)
    {
        $processingOffice->load('user');
        $timeZones = TimeZone::query()->orderBy('label')->get(['id', 'label']);
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return $this->factory->render('agents/processing-offices/edit', [
            'processingOffice' => new ProcessingOfficeResource($processingOffice),
            'timeZones' => $timeZones,
            'countries' => $countries,
        ]);
    }

    public function update(UpdateProcessingOfficeRequest $request, ProcessingOffice $processingOffice, UpdateProcessingOfficeAction $action)
    {
        try {
            $action->execute($request, $processingOffice);

            return to_route('agents:processing-offices:index')->with('success', 'Processing Office updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update processing office: '.$e->getMessage()]);
        }
    }
}
