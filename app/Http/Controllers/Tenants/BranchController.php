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

    public function index()
    {
        $branches = Branch::with('country')->get(); 
        return BranchResource::collection($branches);
    }
}
