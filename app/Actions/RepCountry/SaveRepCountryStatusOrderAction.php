<?php

namespace App\Actions\RepCountry;

use App\Models\RepCountry;
use Illuminate\Http\Request;

class SaveRepCountryStatusOrderAction
{
    public function execute(Request $request, RepCountry $repCountry): void
    {
        $request->validate([
            'status_order' => 'required|array',
            'status_order.*.status_name' => 'required|string',
            'status_order.*.order' => 'required|integer|min:1',
        ]);

        $statusOrder = $request->input('status_order', []);
        foreach ($statusOrder as $item) {
            $repCountry->repCountryStatuses()->where('status_name', $item['status_name'])->update([
                'order' => $item['order']
            ]);
        }
    }
} 