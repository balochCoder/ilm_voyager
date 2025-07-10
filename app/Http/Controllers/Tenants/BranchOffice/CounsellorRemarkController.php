<?php

namespace App\Http\Controllers\Tenants\BranchOffice;

use App\Actions\BranchOffice\StoreBranchCounsellorRemarkAction;
use App\Actions\BranchOffice\UpdateBranchCounsellorRemarkAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\CounsellorRemarkResource;
use Illuminate\Http\Request;

class CounsellorRemarkController extends Controller
{
    public function index($counsellorId)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->where('id', $counsellorId)->firstOrFail();
        $remarks = $counsellor->remarks()->with('addedByUser')->orderBy('remark_date', 'desc')->get();

        return response()->json(['data' => CounsellorRemarkResource::collection($remarks)]);
    }

    public function store(Request $request, $counsellorId, StoreBranchCounsellorRemarkAction $storeAction)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->where('id', $counsellorId)->firstOrFail();
        $data = $request->validate([
            'remark' => 'required|string',
            'remark_date' => 'required|date',
        ]);
        $remark = $storeAction->execute($counsellor, $data);

        return response()->json(['data' => new CounsellorRemarkResource($remark)], 201);
    }

    public function update(Request $request, $counsellorId, $remarkId, UpdateBranchCounsellorRemarkAction $updateAction)
    {
        $user = auth()->user();
        if (! $user->hasRole('branch-office')) {
            abort(403);
        }
        $branch = $user->branch;
        if (! $branch) {
            abort(404, 'Branch not found for this user.');
        }
        $counsellor = $branch->counsellors()->where('id', $counsellorId)->firstOrFail();
        $remark = $counsellor->remarks()->where('id', $remarkId)->firstOrFail();
        $data = $request->validate([
            'remark' => 'required|string',
            'remark_date' => 'required|date',
        ]);
        $remark = $updateAction->execute($remark, $data);

        return response()->json(['data' => new CounsellorRemarkResource($remark)]);
    }
}
