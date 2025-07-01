<?php

declare(strict_types=1);

namespace App\Actions\Institution;

use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use App\Models\RepCountry;
use App\Models\Currency;
use Illuminate\Http\Request;

final class GetInstitutionsIndexDataAction
{
    public function execute(Request $request): array
    {
        $query = Institution::with(['repCountry.country', 'currency'])->orderByDesc('created_at');

        if ($request->filled('country_id') && $request->country_id !== 'all') {
            $query->whereHas('repCountry', function ($q) use ($request) {
                $q->where('rep_country_id', $request->country_id);
            });
        }
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('institute_type', $request->type);
        }
        if ($request->filled('institution_name')) {
            $query->where('institution_name', 'like', '%' . $request->institution_name . '%');
        }
        if ($request->filled('contact_person_email')) {
            $query->where('contact_person_email', 'like', '%' . $request->contact_person_email . '%');
        }
        if ($request->filled('keyword')) {
            $q = $request->keyword;
            $query->where(function ($sub) use ($q) {
                $sub->where('institution_name', 'like', "%$q%")
                    ->orWhere('contact_person_email', 'like', "%$q%")
                    ->orWhere('contact_person_name', 'like', "%$q%")
                ;
            });
        }
        if ($request->filled('contract_expiry_start')) {
            $query->whereDate('contract_expiry_date', '>=', $request->contract_expiry_start);
        }
        if ($request->filled('contract_expiry_end')) {
            $query->whereDate('contract_expiry_date', '<=', $request->contract_expiry_end);
        }

        $institutions = InstitutionResource::collection($query->paginate(10)->withQueryString());
        $institutionsTotal = Institution::count();
        $institutionsActive = Institution::where('is_active', true)->count();
        $institutionsDirect = Institution::where('institute_type', 'direct')->count();
        $repCountries = RepCountry::with('country')->where('is_active', true)->orderBy('created_at', 'desc')->get();
        $currencies = Currency::orderBy('name')->get();

        return [
            'institutions' => $institutions,
            'repCountries' => $repCountries,
            'currencies' => $currencies,
            'institutionsTotal' => $institutionsTotal,
            'institutionsActive' => $institutionsActive,
            'institutionsDirect' => $institutionsDirect,
        ];
    }
}
