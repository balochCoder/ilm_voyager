<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, HasUlids;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'agency_name',
            'email',
            'password',
            'website',
            'is_approved'
        ];
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value,
            set: fn($value) => bcrypt($value)
        );
    }
}
