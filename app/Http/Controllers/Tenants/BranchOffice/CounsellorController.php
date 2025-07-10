<?php

namespace App\Http\Controllers\Tenants\BranchOffice;

use App\Actions\BranchOffice\StoreBranchCounsellorAction;
use App\Actions\BranchOffice\ToggleBranchCounsellorStatusAction;
use App\Actions\BranchOffice\UpdateBranchCounsellorAction;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Counsellor\StoreBranchCounsellorRequest;
use App\Http\Requests\Counsellor\UpdateBranchCounsellorRequest;
use App\Http\Resources\CounsellorResource;
use App\Models\Counsellor;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\Request;

class CounsellorController extends Controller
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
        $query = $branch->counsellors()->with(['user', 'branch']);
        if ($request->filled('filter.status') && $request->input('filter.status') !== 'all') {
            $query->where('is_active', $request->input('filter.status') === 'active');
        }
        if ($request->filled('filter.keyword')) {
            $keyword = $request->input('filter.keyword');
            $query->whereHas('user', function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                    ->orWhere('email', 'like', "%$keyword%")
                    ->orWhere('phone', 'like', "%$keyword%")
                    ->orWhere('mobile', 'like', "%$keyword%");
            });
        }
        if ($request->filled('filter.email')) {
            $email = $request->input('filter.email');
            $query->whereHas('user', function ($q) use ($email) {
                $q->where('email', 'like', "%$email%");
            });
        }
        if ($request->filled('filter.download_csv') && $request->input('filter.download_csv') !== 'all') {
            $downloadCsv = $request->input('filter.download_csv');
            $query->whereHas('user', function ($q) use ($downloadCsv) {
                $q->where('download_csv', $downloadCsv);
            });
        }
        $counsellors = $query->paginate(10)->withQueryString();
        $counsellorsActive = $branch->counsellors()->where('is_active', true)->count();
        $counsellorsTotal = $branch->counsellors()->count();

        return $this->factory->render('branches/counsellors/index', [
            'counsellors' => CounsellorResource::collection($counsellors),
            'counsellorsTotal' => $counsellorsTotal,
            'counsellorsActive' => $counsellorsActive,
        ]);
    }

    public function create()
    {
        // No branch selection, always use authenticated user's branch
        return inertia('branches/counsellors/create');
    }

    public function store(StoreBranchCounsellorRequest $request, StoreBranchCounsellorAction $storeAction)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $storeAction->execute($request, $branch);

        return redirect()->route('branches:counsellors:index')->with('success', 'Counsellor created successfully.');
    }

    public function edit($counsellorId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->with('user')->findOrFail($counsellorId);

        return $this->factory->render('branches/counsellors/edit', [
            'counsellor' => new CounsellorResource($counsellor),
        ]);
    }

    public function update(UpdateBranchCounsellorRequest $request, $counsellorId, UpdateBranchCounsellorAction $updateAction)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->with('user')->findOrFail($counsellorId);
        $updateAction->execute($request, $counsellor);

        return redirect()->route('branches:counsellors:index')->with('success', 'Counsellor updated successfully.');
    }

    public function toggleStatus($counsellorId, ToggleBranchCounsellorStatusAction $toggleStatusAction)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->with('user')->findOrFail($counsellorId);
        $toggleStatusAction->execute($counsellor);

        return back()->with('success', 'Counsellor status updated successfully.');
    }

    public function assignInstitutions($counsellorId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->with(['user', 'branch'])->findOrFail($counsellorId);

        // Get all active institutions with their countries through repCountry
        $institutions = Institution::query()
            ->with('repCountry.country:id,name')
            ->where('is_active', true)
            ->orderBy('institution_name')
            ->get(['id', 'institution_name', 'rep_country_id']);

        // Group institutions by country
        $institutionsByCountry = $institutions->groupBy('repCountry.country.name');

        // Get the counsellor's currently assigned institutions
        $assignedInstitutionIds = $counsellor->assigned_institutions ?? [];

        return $this->factory->render('branches/counsellors/assign-institutions', [
            'counsellor' => new \App\Http\Resources\CounsellorResource($counsellor),
            'institutionsByCountry' => $institutionsByCountry,
            'assignedInstitutionIds' => $assignedInstitutionIds,
        ]);
    }

    public function storeInstitutionAssignments(Request $request, $counsellorId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->findOrFail($counsellorId);

        $request->validate([
            'institution_ids' => 'array',
            'institution_ids.*' => 'exists:institutions,id',
        ]);

        $counsellor->update([
            'assigned_institutions' => $request->institution_ids ?? [],
        ]);

        return redirect()->route('branches:counsellors:index')->with('success', 'Institutions assigned successfully.');
    }
}
