<?php

namespace App\Actions\Associate;

use App\Models\Associate;

class IndexAssociateAction
{
    public function execute($request)
    {
        $query = Associate::with(['branch', 'country']);
        // Add filters here if needed
        return $query->orderByDesc('created_at')->paginate(10)->withQueryString();
    }
}
