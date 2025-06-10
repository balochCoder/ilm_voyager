<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'domain' => 'required|string|max:255|unique:domains,domain',
            'agency_name' => 'required|string|max:255',
            'website' => 'required|url|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $tenant = Tenant::query()->create([
            'agency_name' => $request->agency_name,
            'name' =>  $request->name,
            'website' => $request->website,
            'email' => $request->email,
            'password' => $request->password
        ]);

        $tenant->domains()->create([
            'domain' => $request->domain . '.' . config('app.domain'),
        ]);

        $tenant->run(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole(TenantRolesEnum::SUPERADMIN->value);

            event(new Registered($user));
        });



        // Auth::login($user);

        return to_route('register')->with('status', 'Waiting for approval');
    }
}
