<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class RepCountryStatus extends Model
{
    protected $table = 'rep_country_status';

    public function repCountry()
    {
        return $this->belongsTo(RepCountry::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
