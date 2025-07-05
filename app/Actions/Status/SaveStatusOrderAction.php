<?php

declare(strict_types=1);

namespace App\Actions\Status;

use App\Models\RepCountry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SaveStatusOrderAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        $request->validate([
            'status_order' => 'required|array',
            'status_order.*.status_name' => 'required|string',
            'status_order.*.order' => 'required|integer|min:1',
        ]);

        try {
            $statusOrder = $request->input('status_order', []);

            foreach ($statusOrder as $item) {
                $repCountry->repCountryStatuses()->where('status_name', $item['status_name'])->update([
                    'order' => $item['order'],
                ]);
            }
        } catch (Throwable $e) {
            Log::error('Failed to save RepCountry status order', [
                'rep_country_id' => $repCountry->id,
                'request' => $request->all(),
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
