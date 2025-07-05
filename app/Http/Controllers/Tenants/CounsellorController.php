<?php

namespace App\Http\Controllers\Tenants;

use App\Actions\Counsellor\IndexCounsellorAction;
use App\Actions\Counsellor\StoreCounsellorAction;
use App\Actions\Counsellor\UpdateCounsellorAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Counsellor\StoreCounsellorRequest;
use App\Http\Requests\Counsellor\UpdateCounsellorRequest;
use App\Http\Resources\CounsellorResource;
use App\Models\Branch;
use App\Models\Counsellor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CounsellorController extends Controller
{
    use InertiaRoute;

    public function create()
    {
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return $this->factory->render('agents/counsellors/create', [
            'branches' => $branches,
        ]);
    }

    public function store(StoreCounsellorRequest $request, StoreCounsellorAction $action)
    {
        try {
            $action->execute($request);

            return to_route('agents:counsellors:index')->with('success', 'Counsellor and user created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create counsellor and user: '.$e->getMessage()]);
        }
    }

    public function index(Request $request, IndexCounsellorAction $action)
    {
        $data = $action->execute($request);

        return $this->factory->render('agents/counsellors/index', $data);
    }

    public function toggleStatus(Request $request, Counsellor $counsellor)
    {
        $counsellor->is_active = ! $counsellor->is_active;
        $counsellor->save();

        // Update user activation status
        if ($counsellor->user) {
            $counsellor->user->is_active = $counsellor->is_active;
            $counsellor->user->save();
        }

        return back()->with('success', 'Counsellor status updated successfully.');
    }

    public function edit(Counsellor $counsellor)
    {
        $counsellor->load(['user', 'branch']);
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return $this->factory->render('agents/counsellors/edit', [
            'counsellor' => new CounsellorResource($counsellor),
            'branches' => $branches,
        ]);
    }

    public function update(UpdateCounsellorRequest $request, Counsellor $counsellor, UpdateCounsellorAction $action)
    {
        try {
            $action->execute($request, $counsellor);

            return to_route('agents:counsellors:index')->with('success', 'Counsellor updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update counsellor: '.$e->getMessage()]);
        }
    }

        public function assignInstitutions(Counsellor $counsellor)
    {
        $counsellor->load(['user', 'branch']);

        // Get all institutions with their countries through repCountry
        $institutions = \App\Models\Institution::query()
            ->with('repCountry.country:id,name')
            ->where('is_active', true)
            ->orderBy('institution_name')
            ->get(['id', 'institution_name', 'rep_country_id']);

        // Group institutions by country
        $institutionsByCountry = $institutions->groupBy('repCountry.country.name');

        // Get the counsellor's currently assigned institutions
        $assignedInstitutionIds = $counsellor->assigned_institutions ?? [];

        return $this->factory->render('agents/counsellors/assign-institutions', [
            'counsellor' => new CounsellorResource($counsellor),
            'institutionsByCountry' => $institutionsByCountry,
            'assignedInstitutionIds' => $assignedInstitutionIds,
        ]);
    }

    public function storeInstitutionAssignments(Request $request, Counsellor $counsellor)
    {
        $request->validate([
            'institution_ids' => 'array',
            'institution_ids.*' => 'exists:institutions,id',
        ]);

        try {
            // Debug: Log the received data
            Log::info('Assigning institutions to counsellor', [
                'counsellor_id' => $counsellor->id,
                'institution_ids' => $request->institution_ids,
                'all_request_data' => $request->all(),
            ]);

            // Check if the assigned_institutions column exists
            $hasColumn = Schema::hasColumn('counsellors', 'assigned_institutions');
            Log::info('Column check', ['has_assigned_institutions_column' => $hasColumn]);

            if (!$hasColumn) {
                Log::error('assigned_institutions column does not exist');
                return back()->withErrors(['error' => 'Database column not found. Please run migrations.']);
            }

            // For now, we'll just store the assignments in a simple way
            // You might want to create a pivot table for counsellor_institution relationships
            $counsellor->update([
                'assigned_institutions' => $request->institution_ids ?? [],
            ]);

            Log::info('Institutions assigned successfully', [
                'counsellor_id' => $counsellor->id,
                'assigned_institutions' => $counsellor->fresh()->assigned_institutions,
            ]);

            return to_route('agents:counsellors:index')->with('success', 'Institutions assigned successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to assign institutions', [
                'counsellor_id' => $counsellor->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['error' => 'Failed to assign institutions: '.$e->getMessage()]);
        }
    }
}
