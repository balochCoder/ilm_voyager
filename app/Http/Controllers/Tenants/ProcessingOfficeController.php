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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

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

    public function assignInstitutions(ProcessingOffice $processingOffice)
    {
        $processingOffice->load(['user']);

        // Get all institutions with their countries through repCountry
        $institutions = \App\Models\Institution::query()
            ->with('repCountry.country:id,name')
            ->where('is_active', true)
            ->orderBy('institution_name')
            ->get(['id', 'institution_name', 'rep_country_id']);

        // Group institutions by country
        $institutionsByCountry = $institutions->groupBy('repCountry.country.name');

        // Get the processing office's currently assigned institutions
        $assignedInstitutionIds = $processingOffice->assigned_institutions ?? [];

        return $this->factory->render('agents/processing-offices/assign-institutions', [
            'processingOffice' => new ProcessingOfficeResource($processingOffice),
            'institutionsByCountry' => $institutionsByCountry,
            'assignedInstitutionIds' => $assignedInstitutionIds,
        ]);
    }

    public function storeInstitutionAssignments(Request $request, ProcessingOffice $processingOffice)
    {
        $request->validate([
            'institution_ids' => 'array',
            'institution_ids.*' => 'exists:institutions,id',
        ]);

        try {
            // Debug: Log the received data
            Log::info('Assigning institutions to processing office', [
                'processing_office_id' => $processingOffice->id,
                'institution_ids' => $request->institution_ids,
                'all_request_data' => $request->all(),
            ]);

            // Check if the assigned_institutions column exists
            $hasColumn = Schema::hasColumn('processing_offices', 'assigned_institutions');
            Log::info('Column check', ['has_assigned_institutions_column' => $hasColumn]);

            if (! $hasColumn) {
                Log::error('assigned_institutions column does not exist');

                return back()->withErrors(['error' => 'Database column not found. Please run migrations.']);
            }

            // Store the assignments
            $processingOffice->update([
                'assigned_institutions' => $request->institution_ids ?? [],
            ]);

            Log::info('Institutions assigned successfully', [
                'processing_office_id' => $processingOffice->id,
                'assigned_institutions' => $processingOffice->fresh()->assigned_institutions,
            ]);

            return to_route('agents:processing-offices:index')->with('success', 'Institutions assigned successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to assign institutions', [
                'processing_office_id' => $processingOffice->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['error' => 'Failed to assign institutions: '.$e->getMessage()]);
        }
    }
}
