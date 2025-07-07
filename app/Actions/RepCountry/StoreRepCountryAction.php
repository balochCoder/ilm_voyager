<?php

declare(strict_types=1);

namespace App\Actions\RepCountry;

use App\Http\Requests\RepCountry\StoreRepCountryRequest;
use App\Models\RepCountry;
use App\Models\Status;
use Illuminate\Validation\ValidationException;

final class StoreRepCountryAction
{
    /**
     * Store a new rep country.
     */
    public function execute(StoreRepCountryRequest $request): RepCountry
    {
        $validated = $request->validated();
        $statusIds = $request->input('status_ids', []);
        $repCountry = RepCountry::create($validated);

        $newStatus = Status::where('name', 'New')->first();
        $allStatusIds = $newStatus ? array_unique(array_merge([$newStatus->id], $statusIds)) : $statusIds;

        if (! empty($allStatusIds)) {
            // Check for duplicate status names before creating
            $statusNames = [];
            foreach ($allStatusIds as $statusId) {
                $status = Status::find($statusId);
                if ($status) {
                    if (in_array($status->name, $statusNames)) {
                        throw ValidationException::withMessages([
                            'status_ids' => "Duplicate status '{$status->name}' found. Each status can only be selected once.",
                        ]);
                    }
                    $statusNames[] = $status->name;
                }
            }

            // Create statuses
            foreach ($allStatusIds as $index => $statusId) {
                $status = Status::find($statusId);
                if ($status) {
                    $repCountry->repCountryStatuses()->create([
                        'status_name' => $status->name,
                        'order' => $index + 1,
                    ]);
                }
            }
        }
        return $repCountry;
    }
}
