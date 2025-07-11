<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Enums\TenantRolesEnum;
use App\Http\Controllers\Concerns\InertiaRoute;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

final class ProfileController extends Controller
{
    use InertiaRoute;

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return $this->factory->render(
            'settings/profile',
            [
                'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
            ]
        );
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();
        // route as per role
        if ($request->user()->hasRole(TenantRolesEnum::SUPERADMIN->value)) {
            return to_route('agents:profile:edit');
        }

        return to_route('counsellors:profile:edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
