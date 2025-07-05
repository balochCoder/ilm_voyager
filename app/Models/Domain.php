<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Stancl\Tenancy\Database\Models\Domain as TenancyDomain;

/**
 * App\Models\Domain
 *
 * @property string $id
 * @property string $domain
 * @property string $tenant_id
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 */
final class Domain extends TenancyDomain
{
    use HasUlids;
}
