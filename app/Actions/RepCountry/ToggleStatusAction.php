<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Requests\RepCountry\ToggleStatusRequest;
use App\Models\RepCountry;
use App\Notifications\RepCountryStatusChanged;
use Illuminate\Support\Facades\Notification;
use App\Services\CacheService;

final class ToggleStatusAction
{
    /**
     * Toggle the rep country status.
     */
    public function execute(RepCountry $repCountry, ToggleStatusRequest $request): RepCountry
    {
        $validated = $request->validated();

        $repCountry->update(['is_active' => $validated['is_active']]);
        // Invalidate rep country cache
        app(CacheService::class)->flushTags(['rep_countries']);
        // Queue notification (example: notify the owner or admin)
        // Replace with actual user logic as needed
        // $notifiable = $repCountry->user ?? \App\Models\User::first();
        // if ($notifiable) {
        //     Notification::send($notifiable, new RepCountryStatusChanged($repCountry, $validated['is_active'] ? 'Active' : 'Inactive'));
        // }

        return $repCountry->fresh();
    }
}
