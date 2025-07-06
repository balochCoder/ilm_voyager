<?php

namespace App\Actions\ProcessingOffice;

use App\Http\Resources\ProcessingOfficeResource;
use App\Models\ProcessingOffice;
use App\Models\Country;
use Illuminate\Http\Request;

class IndexProcessingOfficeAction
{
    public function execute(Request $request): array
    {
        $query = ProcessingOffice::with(['country', 'user']);

        // Apply filters
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                    ->orWhere('address', 'like', "%{$keyword}%")
                    ->orWhere('city', 'like', "%{$keyword}%")
                    ->orWhere('state', 'like', "%{$keyword}%")
                    ->orWhereHas('user', function ($userQuery) use ($keyword) {
                        $userQuery->where('name', 'like', "%{$keyword}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        if ($request->filled('country_id')) {
            $query->where('country_id', $request->country_id);
        }

        if ($request->filled('contact_person_email')) {
            $email = $request->contact_person_email;
            $query->whereHas('user', function ($userQuery) use ($email) {
                $userQuery->where('email', 'like', "%{$email}%");
            });
        }

        $processingOffices = $query->paginate(10)->withQueryString();
        $processingOfficesActive = ProcessingOffice::where('is_active', true)->count();
        $countries = Country::query()->orderBy('name')->get(['id', 'name', 'flag']);

        return [
            'processingOffices' => ProcessingOfficeResource::collection($processingOffices),
            'processingOfficesTotal' => $processingOffices->total(),
            'processingOfficesActive' => $processingOfficesActive,
            'countries' => $countries,
        ];
    }
}
