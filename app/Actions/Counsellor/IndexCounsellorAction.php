<?php

namespace App\Actions\Counsellor;

use App\Http\Resources\CounsellorResource;
use App\Models\Branch;
use App\Models\Counsellor;
use Illuminate\Http\Request;

class IndexCounsellorAction
{
    public function execute(Request $request): array
    {
        $query = Counsellor::with(['branch', 'user']);

        // Apply filters
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->whereHas('user', function ($userQuery) use ($keyword) {
                    $userQuery->where('name', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%")
                        ->orWhere('phone', 'like', "%{$keyword}%")
                        ->orWhere('mobile', 'like', "%{$keyword}%");
                });
            });
        }

        if ($request->filled('status')) {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('contact_person_email')) {
            $email = $request->contact_person_email;
            $query->whereHas('user', function ($userQuery) use ($email) {
                $userQuery->where('email', 'like', "%{$email}%");
            });
        }

        if ($request->filled('as_processing_officer')) {
            $isProcessingOfficer = $request->as_processing_officer === 'true';
            $query->where('as_processing_officer', $isProcessingOfficer);
        }

        $counsellors = $query->paginate(10)->withQueryString();
        $counsellorsActive = Counsellor::where('is_active', true)->count();
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return [
            'counsellors' => CounsellorResource::collection($counsellors),
            'counsellorsTotal' => $counsellors->total(),
            'counsellorsActive' => $counsellorsActive,
            'branches' => $branches,
        ];
    }
}
