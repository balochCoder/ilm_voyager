<?php

declare(strict_types=1);

namespace App\Enums;

enum CentralRolesEnum: string
{
    case OWNER = 'owner';

    public function label(): string
    {
        return match ($this) {
            self::OWNER => 'Owner',

        };
    }
}
