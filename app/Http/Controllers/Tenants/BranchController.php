<?php

namespace App\Http\Controllers\Tenants;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use App\Models\TimeZone;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Requests\Branch\StoreBranchRequest;
use App\Actions\Branch\StoreBranchAction;
use App\Http\Resources\BranchResource;
use App\Http\Requests\Branch\UpdateBranchRequest;
use App\Actions\Branch\UpdateBranchAction;
use App\Actions\Branch\IndexBranchAction;

class BranchController extends Controller
{
    use InertiaRoute;

    public function create()
    {
        $timeZones = TimeZone::query()->orderBy('label')->get(['id', 'label']);
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);
        return $this->factory->render('agents/branches/create', [
            'timeZones' => $timeZones,
            'countries' => $countries,
        ]);
    }
    public function store(StoreBranchRequest $request, StoreBranchAction $action)
    {
        try {
            $action->execute($request);
            return to_route('agents:branches:index')->with('success', 'Branch and user created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create branch and user: ' . $e->getMessage()]);
        }
    }

    public function index(Request $request, IndexBranchAction $action)
    {
        $data = $action->execute($request);

        return $this->factory->render('agents/branches/index', $data);
    }

    public function toggleStatus(Request $request, Branch $branch)
    {
        $branch->is_active = !$branch->is_active;
        $branch->save();
        // Update all users of this branch
        if ($branch->user) {
            $branch->user->is_active = $branch->is_active;
            $branch->user->save();
        }
        return back()->with('success', 'Branch status updated successfully.');
    }

    public function edit(Branch $branch)
    {
        $branch->load('user');
        $timeZones = TimeZone::query()->orderBy('label')->get(['id', 'label']);
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return $this->factory->render('agents/branches/edit', [
            'branch' => new BranchResource($branch),
            'timeZones' => $timeZones,
            'countries' => $countries,
        ]);
    }

    public function update(UpdateBranchRequest $request, Branch $branch, UpdateBranchAction $action)
    {
        try {
            $action->execute($request, $branch);
            return to_route('agents:branches:index')->with('success', 'Branch updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update branch: ' . $e->getMessage()]);
        }
    }
}
