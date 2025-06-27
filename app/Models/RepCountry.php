<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class RepCountry extends Model
{
    use HasUlids;
    use SoftDeletes;

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function repCountryStatuses()
    {
        return $this->hasMany(RepCountryStatus::class);
    }

    public function getStatusesAttribute()
    {
        return $this->repCountryStatuses;
    }

    protected function casts()
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
