<?php

namespace App\Enums;

enum CentralRolesEnum: string
{
    case OWNER = 'owner';
   
    public function label(): string
    {
        return match ($this) {
            static::OWNER => 'Owner',

        };
    }
}
