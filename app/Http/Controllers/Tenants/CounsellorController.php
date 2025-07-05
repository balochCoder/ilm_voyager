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

        // Get all institutions for assignment
        $institutions = \App\Models\Institution::query()
            ->where('is_active', true)
            ->orderBy('institution_name')
            ->get(['id', 'institution_name']);

        return $this->factory->render('agents/counsellors/assign-institutions', [
            'counsellor' => new CounsellorResource($counsellor),
            'institutions' => $institutions,
        ]);
    }

    public function storeInstitutionAssignments(Request $request, Counsellor $counsellor)
    {
        $request->validate([
            'institution_ids' => 'array',
            'institution_ids.*' => 'exists:institutions,id',
        ]);

        try {
            // For now, we'll just store the assignments in a simple way
            // You might want to create a pivot table for counsellor_institution relationships
            $counsellor->update([
                'assigned_institutions' => $request->institution_ids ?? [],
            ]);

            return to_route('agents:counsellors:index')->with('success', 'Institutions assigned successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to assign institutions: '.$e->getMessage()]);
        }
    }
}
