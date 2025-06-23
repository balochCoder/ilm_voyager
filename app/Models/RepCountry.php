<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RepCountry extends Model
{
    use HasUlids;
    use SoftDeletes;



    protected function casts()
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function statuses(): BelongsToMany
    {
        return $this->belongsToMany(Status::class, 'rep_country_status')
                    ->withPivot(['notes', 'completed_at', 'is_current'])
                    ->withTimestamps();
    }

    public function currentStatus()
    {
        return $this->statuses()->wherePivot('is_current', true)->first();
    }
}
