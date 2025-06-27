<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

final class Country extends Model
{
    use HasUlids;

    public function repCountry(): HasOne
    {
        return $this->hasOne(RepCountry::class);
    }

    protected function casts()
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
