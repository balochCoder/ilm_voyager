<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasUlids;

    
   protected function casts()
   {
         return [
              'is_active' => 'boolean',
         ];
   }
}
