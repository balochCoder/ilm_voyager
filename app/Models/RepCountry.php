<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RepCountry
 *
 * @property string $id
 * @property string|null $monthly_living_cost
 * @property string|null $visa_requirements
 * @property string|null $part_time_work_details
 * @property string|null $country_benefits
 * @property bool $is_active
 * @property string $country_id
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property CarbonInterface|null $deleted_at
 * @property-read Country $country
 * @property-read RepCountryStatus[] $repCountryStatuses
 *
 * @mixin \Eloquent
 */
final class RepCountry extends Model
{
    use HasUlids;
    use SoftDeletes;

    /** @return BelongsTo<Country> */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /** @return HasMany<RepCountryStatus> */
    public function repCountryStatuses(): HasMany
    {
        return $this->hasMany(RepCountryStatus::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
