<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class TimeZone extends Model
{
    use HasUlids;

    protected $table = 'time_zones';
}
