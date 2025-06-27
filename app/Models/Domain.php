<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Stancl\Tenancy\Database\Models\Domain as TenancyDomain;

final class Domain extends TenancyDomain
{
    use HasUlids;
}
