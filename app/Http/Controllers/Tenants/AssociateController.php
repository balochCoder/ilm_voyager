<?php

namespace App\Http\Controllers\Tenants;

use App\Actions\Associate\StoreAssociateAction;
use App\Actions\Associate\UpdateAssociateAction;
use App\Actions\Associate\IndexAssociateAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Associate\StoreAssociateRequest;
use App\Http\Requests\Associate\UpdateAssociateRequest;
use App\Models\Associate;
use App\Models\Branch;
use App\Models\Country;
use Illuminate\Http\Request;
use App\Http\Resources\AssociateResource;

class AssociateController extends Controller
{
    public function create()
    {
        $branches = Branch::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $countries = Country::where('is_active', true)->orderBy('name')->get(['id', 'name', 'flag']);
        return inertia('agents/associates/create', [
            'branches' => $branches,
            'countries' => $countries,
        ]);
    }

    public function store(StoreAssociateRequest $request, StoreAssociateAction $action)
    {
        try {
            $action->execute($request);
            return to_route('agents:associates:index')->with('success', 'Associate and user created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create associate and user: ' . $e->getMessage()]);
        }
    }

    public function index(Request $request, IndexAssociateAction $action)
    {
        $associates = $action->execute($request);
        $associatesTotal = Associate::count();
        $associatesActive = Associate::where('is_active', true)->count();
        return inertia('agents/associates/index', [
            'associates' => AssociateResource::collection($associates),
            'associatesTotal' => $associatesTotal,
            'associatesActive' => $associatesActive,
        ]);
    }

    public function edit(Associate $associate)
    {
        $associate->load(['user', 'branch', 'country']);
        $branches = Branch::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $countries = Country::where('is_active', true)->orderBy('name')->get(['id', 'name', 'flag']);
        return inertia('agents/associates/edit', [
            'associate' => $associate,
            'branches' => $branches,
            'countries' => $countries,
        ]);
    }

    public function update(UpdateAssociateRequest $request, Associate $associate, UpdateAssociateAction $action)
    {
        try {
            $action->execute($request, $associate);
            return to_route('agents:associates:index')->with('success', 'Associate updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update associate: ' . $e->getMessage()]);
        }
    }

    public function toggleStatus(Request $request, Associate $associate)
    {
        $associate->is_active = !$associate->is_active;
        $associate->save();
        if ($associate->user) {
            $associate->user->is_active = $associate->is_active;
            $associate->user->save();
        }
        return back()->with('success', 'Associate status updated successfully.');
    }

    public function show(Associate $associate)
    {
        $associate->load(['user', 'branch', 'country']);
        return inertia('agents/associates/show', [
            'associate' => $associate,
        ]);
    }
}
