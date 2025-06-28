<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Permission\Models\Permission as SpatiePermission;

/**
 * App\Models\Permission
 *
 * @property string $id
 * @property string $name
 * @property string $guard_name
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 *
 */
final class Permission extends SpatiePermission
{
    use HasUlids;
}
