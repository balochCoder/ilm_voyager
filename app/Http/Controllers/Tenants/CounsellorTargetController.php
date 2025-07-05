<?php

namespace App\Http\Controllers\Tenants;

use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\CounsellorTarget\StoreCounsellorTargetRequest;
use App\Http\Resources\CounsellorTargetResource;
use App\Models\Counsellor;
use App\Models\CounsellorTarget;
use Illuminate\Http\Request;

class CounsellorTargetController extends Controller
{
    use InertiaRoute;

    /**
     * Display a listing of the counsellor's targets.
     */
    public function index(Counsellor $counsellor)
    {
        $counsellor->load(['user', 'branch', 'targets.addedByUser']);

        // Return JSON for API requests
        if (request()->expectsJson()) {
            return response()->json([
                'data' => CounsellorTargetResource::collection($counsellor->targets),
            ]);
        }

        return $this->factory->render('agents/counsellors/targets/index', [
            'counsellor' => $counsellor,
            'targets' => CounsellorTargetResource::collection($counsellor->targets),
        ]);
    }

    /**
     * Store a newly created target in storage.
     */
    public function store(StoreCounsellorTargetRequest $request, Counsellor $counsellor)
    {
        try {
            $target = $counsellor->targets()->create([
                'number_of_applications' => $request->number_of_applications,
                'year' => now()->year,
                'description' => $request->description,
                'added_by_user_id' => auth()->id(),
            ]);

            return back()
                ->with('success', 'Target added successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to add target: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified target in storage.
     */
    public function update(StoreCounsellorTargetRequest $request, Counsellor $counsellor, CounsellorTarget $target)
    {
        try {
            // Check if the current user is authorized to edit this target
            if ($target->added_by_user_id !== auth()->id() && !auth()->user()->hasRole('superadmin')) {
                return back()->withErrors(['error' => 'You are not authorized to edit this target.']);
            }

            $target->update([
                'number_of_applications' => $request->number_of_applications,
                'description' => $request->description,
                'is_edited' => true,
            ]);

            return back()
                ->with('success', 'Target updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update target: ' . $e->getMessage()]);
        }
    }
}
