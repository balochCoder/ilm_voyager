<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Country
 *
 * @property string $id
 * @property string $name
 * @property string $flag
 * @property bool $is_active
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 *
 * @property-read RepCountry|null $repCountry
 *
 */
final class Country extends Model
{
    use HasUlids;

    /** @return HasOne<RepCountry> */
    public function repCountry(): HasOne
    {
        return $this->hasOne(RepCountry::class);
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
