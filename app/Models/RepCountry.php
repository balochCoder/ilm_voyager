<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepCountry extends Model
{
    use HasUlids, SoftDeletes;

    protected $fillable = [
        'monthly_living_cost',
        'visa_requirements',
        'part_time_work_details',
        'country_benefits',
        'is_active',
        'country_id',
    ];

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
} 