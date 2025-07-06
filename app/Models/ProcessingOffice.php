<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessingOffice extends Model
{
    use HasUlids;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'country_id',
        'time_zone_id',
        'phone',
        'user_id',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function country()
    {
        return $this->belongsTo(\App\Models\Country::class, 'country_id');
    }

    public function timeZone()
    {
        return $this->belongsTo(\App\Models\TimeZone::class, 'time_zone_id');
    }
}
