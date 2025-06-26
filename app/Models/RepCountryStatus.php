<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepCountryStatus extends Model
{
    protected $table = 'rep_country_status';
    
    public function repCountry()
    {
        return $this->belongsTo(RepCountry::class);
    }
}
