<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\RepCountryStatus
 *
 * @property int $id
 * @property string $rep_country_id
 * @property string $status_name
 * @property string|null $notes
 * @property CarbonInterface|null $completed_at
 * @property bool $is_current
 * @property int $order
 * @property bool $is_active
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read RepCountry $repCountry
 * @property-read SubStatus[] $subStatuses
 *
 * @mixin \Eloquent
 */
final class RepCountryStatus extends Model
{
    protected $table = 'rep_country_status';

    /** @return BelongsTo<RepCountry> */
    public function repCountry(): BelongsTo
    {
        return $this->belongsTo(RepCountry::class);
    }

    /** @return HasMany<SubStatus> */
    public function subStatuses(): HasMany
    {
        return $this->hasMany(SubStatus::class)->ordered();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'is_current' => 'boolean',
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
