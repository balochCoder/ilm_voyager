<?php

namespace App\Actions\Counsellor;

use App\Http\Resources\CounsellorResource;
use App\Models\Branch;
use App\Models\Counsellor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IndexCounsellorAction
{
    public function execute(Request $request): array
    {
        // Debug: Log the request parameters
        Log::info('Counsellor search request', [
            'all_params' => $request->all(),
            'keyword' => $request->get('keyword'),
            'status' => $request->get('status'),
            'branch_id' => $request->get('branch_id'),
            'contact_person_email' => $request->get('contact_person_email'),
            'export' => $request->get('export'),
        ]);

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

        if ($request->filled('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        if ($request->filled('branch_id') && $request->branch_id !== 'all') {
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

        // Filter by download_csv (export) if present
        if ($request->filled('export') && $request->export !== 'all') {
            if ($request->export === 'not_allowed') {
                $query->whereHas('user', function ($q) {
                    $q->where('download_csv', 'not_allowed');
                });
            } elseif ($request->export === 'allowed_without_contact') {
                $query->whereHas('user', function ($q) {
                    $q->where('download_csv', 'allowed_without_contact');
                });
            } else {
                $query->whereHas('user', function ($q) {
                    $q->where('download_csv', 'allowed');
                });
            }
        }

        $counsellors = $query->paginate(10)->withQueryString();
        $counsellorsActive = Counsellor::where('is_active', true)->count();
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        // Debug: Log the results
        Log::info('Counsellor search results', [
            'total_counsellors' => $counsellors->total(),
            'current_page' => $counsellors->currentPage(),
            'per_page' => $counsellors->perPage(),
            'active_counsellors' => $counsellorsActive,
            'branches_count' => $branches->count(),
            'sql_query' => $query->toSql(),
            'sql_bindings' => $query->getBindings(),
        ]);

        return [
            'counsellors' => CounsellorResource::collection($counsellors),
            'counsellorsTotal' => $counsellors->total(),
            'counsellorsActive' => $counsellorsActive,
            'branches' => $branches,
        ];
    }
}
