<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Models\Domain as TenancyDomain;

class Domain extends TenancyDomain
{
    use HasUlids;
}
