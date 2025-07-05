<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SubStatus
 *
 * @property int $id
 * @property int $rep_country_status_id
 * @property string $name
 * @property string|null $description
 * @property bool $is_completed
 * @property CarbonInterface|null $completed_at
 * @property int $order
 * @property bool $is_active
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read RepCountryStatus $repCountryStatus
 *
 * @mixin \Eloquent
 */
final class SubStatus extends Model
{
    protected $table = 'sub_statuses';

    /** @return BelongsTo<RepCountryStatus> */
    public function repCountryStatus(): BelongsTo
    {
        return $this->belongsTo(RepCountryStatus::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope a query to order by the order field.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Scope a query to only include active sub-statuses.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
