<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Status extends Model
{
    use HasUlids;

    protected $casts = [
        'order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function repCountries(): BelongsToMany
    {
        return $this->belongsToMany(RepCountry::class, 'rep_country_status')
                    ->withPivot(['notes', 'completed_at', 'is_current'])
                    ->withTimestamps();
    }
}
