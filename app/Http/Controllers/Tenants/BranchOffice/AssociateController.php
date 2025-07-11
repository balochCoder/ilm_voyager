<?php

namespace App\Http\Controllers\Tenants\BranchOffice;

use App\Actions\BranchOffice\StoreBranchAssociateAction;
use App\Actions\BranchOffice\UpdateBranchAssociateAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Associate\StoreAssociateRequest;
use App\Http\Requests\Associate\UpdateAssociateRequest;
use App\Http\Resources\AssociateResource;
use App\Models\Country;
use Illuminate\Http\Request;

class AssociateController extends Controller
{
    use InertiaRoute;

    public function index(Request $request)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $query = $branch->associates()->with(['user', 'branch', 'country']);
        // TODO: Add filters (status, keyword, email, etc.)
        $associates = $query->paginate(10)->withQueryString();
        $associatesActive = $branch->associates()->where('is_active', true)->count();
        $associatesTotal = $branch->associates()->count();

        return $this->factory->render('branches/associates/index', [
            'associates' => AssociateResource::collection($associates),
            'associatesTotal' => $associatesTotal,
            'associatesActive' => $associatesActive,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $countries = Country::where('is_active', true)->orderBy('name')->get(['id', 'name', 'flag']);

        return $this->factory->render('branches/associates/create', [
            'countries' => $countries,
        ]);
    }

    public function store(StoreAssociateRequest $request, StoreBranchAssociateAction $action)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $action->execute($request, $branch);

        return to_route('branches:associates:index')->with('success', 'Associate and user created successfully.');
    }

    public function edit($associateId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $associate = $branch->associates()->with(['user', 'branch', 'country'])->findOrFail($associateId);
        $countries = Country::where('is_active', true)->orderBy('name')->get(['id', 'name', 'flag']);

        return $this->factory->render('branches/associates/edit', [
            'associate' => AssociateResource::make($associate),
            'countries' => $countries,
        ]);
    }

    public function update(UpdateAssociateRequest $request, $associateId, UpdateBranchAssociateAction $action)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $associate = $branch->associates()->findOrFail($associateId);
        $action->execute($request, $associate);

        return to_route('branches:associates:index')->with('success', 'Associate updated successfully.');
    }

    public function toggleStatus($associateId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $associate = $branch->associates()->findOrFail($associateId);
        $associate->is_active = ! $associate->is_active;
        $associate->save();
        if ($associate->user) {
            $associate->user->is_active = $associate->is_active;
            $associate->user->save();
        }

        return back()->with('success', 'Associate status updated successfully.');
    }

    public function show($associateId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $associate = $branch->associates()->with(['user', 'branch', 'country'])->findOrFail($associateId);

        return $this->factory->render('branches/associates/show', [
            'associate' => AssociateResource::make($associate),
        ]);
    }
}
