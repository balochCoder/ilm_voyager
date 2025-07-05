<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\CounsellorRemark\StoreCounsellorRemarkRequest;
use App\Http\Resources\CounsellorRemarkResource;
use App\Models\Counsellor;
use App\Models\CounsellorRemark;
use Illuminate\Http\Request;

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
            return back()->withErrors(['error' => 'Failed to add remark: ' . $e->getMessage()]);
        }
    }


}
