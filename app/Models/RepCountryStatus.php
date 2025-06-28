<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\RepCountryStatus
 *
 * @property string $id
 * @property string $rep_country_id
 * @property string $status_name
 * @property string|null $notes
 * @property CarbonInterface|null $completed_at
 * @property bool $is_current
 * @property int $order
 * @property bool $is_active
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 *
 * @property-read RepCountry $repCountry
 *
 * @mixin \Eloquent
 */
final class RepCountryStatus extends Model
{
    use HasUlids;

    protected $table = 'rep_country_status';

    /** @return BelongsTo<RepCountry> */
    public function repCountry(): BelongsTo
    {
        return $this->belongsTo(RepCountry::class);
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
