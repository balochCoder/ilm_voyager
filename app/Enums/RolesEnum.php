<?php

namespace App\Enums;

enum RolesEnum: string
{
    case OWNER = 'owner';
    case SUPERADMIN = 'super-admin';
    case BRANCHOFFICE = 'branch-office';
    case COUNSELLOR = 'counsellor';
    case PROCESSINGOFFICE = 'processing-office';
    case FRONTOFFICE = 'front-office';
    case ASSOCIATE = 'associate';

    public function label(): string
    {
        return match ($this) {
            static::OWNER => 'Owner',
            static::SUPERADMIN => 'Super Admin',
            static::BRANCHOFFICE => 'Branch Office',
            static::COUNSELLOR => 'Counsellor',
            static::PROCESSINGOFFICE => 'Processing Office',
            static::FRONTOFFICE => 'Front Office',
            static::ASSOCIATE => 'Associate'

        };
    }
}
