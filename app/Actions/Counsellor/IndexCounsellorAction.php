<?php

namespace App\Actions\Counsellor;

use App\Http\Resources\CounsellorResource;
use App\Models\Branch;
use App\Models\Counsellor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class IndexCounsellorAction
{
    public function execute(Request $request): array
    {
        // Debug: Log the request parameters
        Log::info('Counsellor search request', [
            'all_params' => $request->all(),
        ]);

        $query = QueryBuilder::for(Counsellor::class)
            ->with(['branch', 'user'])
            ->allowedFilters([
                AllowedFilter::exact('status', 'is_active'),
                AllowedFilter::exact('branch_id'),
                AllowedFilter::callback('contact_person_email', function ($query, $value) {
                    $query->whereHas('user', function ($userQuery) use ($value) {
                        $userQuery->where('email', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('keyword', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->whereHas('user', function ($userQuery) use ($value) {
                            $userQuery->where('name', 'like', "%{$value}%")
                                ->orWhere('email', 'like', "%{$value}%")
                                ->orWhere('phone', 'like', "%{$value}%")
                                ->orWhere('mobile', 'like', "%{$value}%");
                        });
                    });
                }),
                AllowedFilter::callback('export', function ($query, $value) {
                    if ($value === 'not_allowed') {
                        $query->whereHas('user', function ($q) {
                            $q->where('download_csv', 'not_allowed');
                        });
                    } elseif ($value === 'allowed_without_contact') {
                        $query->whereHas('user', function ($q) {
                            $q->where('download_csv', 'allowed_without_contact');
                        });
                    } elseif ($value === 'allowed') {
                        $query->whereHas('user', function ($q) {
                            $q->where('download_csv', 'allowed');
                        });
                    }
                }),
            ]);

        $counsellors = $query->paginate(12)->withQueryString();
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
