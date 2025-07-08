<?php

namespace App\Http\Controllers\Tenants\Agent;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\CounsellorRemark\StoreCounsellorRemarkRequest;
use App\Http\Resources\CounsellorRemarkResource;
use App\Models\Counsellor;
use App\Models\CounsellorRemark;

class CounsellorRemarkController extends Controller
{
    use InertiaRoute;

    /**
     * Display a listing of the counsellor's remarks.
     */
    public function index(Counsellor $counsellor)
    {
        $counsellor->load(['user', 'branch', 'remarks.addedByUser']);

        // Return JSON for API requests
        if (request()->expectsJson()) {
            return response()->json([
                'data' => CounsellorRemarkResource::collection($counsellor->remarks),
            ]);
        }

        return $this->factory->render('agents/counsellors/remarks/index', [
            'counsellor' => $counsellor,
            'remarks' => CounsellorRemarkResource::collection($counsellor->remarks),
        ]);
    }

    /**
     * Store a newly created remark in storage.
     */
    public function store(StoreCounsellorRemarkRequest $request, Counsellor $counsellor)
    {
        try {
            $remark = $counsellor->remarks()->create([
                'remark' => $request->remark,
                'remark_date' => $request->remark_date ?? now()->toDateString(),
                'added_by_user_id' => auth()->id(),
            ]);

            return back()
                ->with('success', 'Remark added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to add remark: '.$e->getMessage()]);
        }
    }

    /**
     * Update the specified remark in storage.
     */
    public function update(StoreCounsellorRemarkRequest $request, Counsellor $counsellor, CounsellorRemark $remark)
    {
        try {
            // Check if the current user is authorized to edit this remark
            if ($remark->added_by_user_id !== auth()->id() && ! auth()->user()->hasRole('superadmin')) {
                return back()->withErrors(['error' => 'You are not authorized to edit this remark.']);
            }

            $remark->update([
                'remark' => $request->remark,
                'remark_date' => $request->remark_date,
                'is_edited' => true,
            ]);

            return back()
                ->with('success', 'Remark updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update remark: '.$e->getMessage()]);
        }
    }
}
