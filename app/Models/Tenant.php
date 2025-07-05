<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

/**
 * App\Models\Tenant
 *
 * @property string $id
 * @property string $name
 * @property string $agency_name
 * @property string $email
 * @property string $password
 * @property string|null $website
 * @property bool $is_approved
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 */
final class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, HasUlids;

    /**
     * Get the custom columns for the tenant.
     *
     * @return array<string>
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'agency_name',
            'email',
            'password',
            'website',
            'is_approved',
        ];
    }

    /**
     * Get the password attribute.
     *
     * @return Attribute<string, string>
     */
    protected function password(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value,
            set: fn ($value) => bcrypt($value)
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
        ];
    }
}
