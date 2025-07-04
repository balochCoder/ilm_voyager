<?php

namespace App\Http\Controllers\Tenants;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use App\Models\TimeZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    use InertiaRoute;

    public function create()
    {
        $timeZones = TimeZone::query()->orderBy('label')->get(['id', 'label']);
        return $this->factory->render('agents/branches/create', [
            'timeZones' => $timeZones,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Branch fields
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'time_zone_id' => 'required|ulid|exists:time_zones,id',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            // User fields
            'contact_name' => 'required|string|max:255',
            'user_email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'designation' => 'nullable|string|max:255',
            'user_phone' => 'nullable|string|max:255',
            'mobile' => 'required|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'skype' => 'nullable|string|max:255',
            'download_csv' => ['required', Rule::in(['allowed', 'allowed_without_contact', 'not_allowed'])],
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['contact_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['password']),
                'designation' => $validated['designation'] ?? null,
                'phone' => $validated['user_phone'] ?? null,
                'mobile' => $validated['mobile'],
                'whatsapp' => $validated['whatsapp'] ?? null,
                'skype' => $validated['skype'] ?? null,
        'download_csv' => $validated['download_csv'],
            ]);
            $user->assignRole(TenantRolesEnum::BRANCHOFFICE->value);

            $branch = Branch::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
                'country' => $validated['country'],
                'time_zone_id' => $validated['time_zone_id'],
                'phone' => $validated['phone'] ?? null,
                'website' => $validated['website'] ?? null,
                'email' => $validated['email'] ?? null,
            ]);

            DB::commit();
            return response()->json(['message' => 'Branch and user created successfully', 'branch' => $branch, 'user' => $user], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create branch and user', 'details' => $e->getMessage()], 500);
        }
    }
}
