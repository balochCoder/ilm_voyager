<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use App\Http\Requests\RepCountry\StoreRepCountryRequest;
use App\Models\Status;

class StoreRepCountryAction
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
        if (!empty($allStatusIds)) {
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
