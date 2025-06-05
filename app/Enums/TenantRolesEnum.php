<?php

namespace App\Enums;

enum TenantRolesEnum: string
{
   
    case SUPERADMIN = 'super-admin';
    case BRANCHOFFICE = 'branch-office';
    case COUNSELLOR = 'counsellor';
    case PROCESSINGOFFICE = 'processing-office';
    case FRONTOFFICE = 'front-office';
    case ASSOCIATE = 'associate';

    public function label(): string
    {
        return match ($this) {

            static::SUPERADMIN => 'Super Admin',
            static::BRANCHOFFICE => 'Branch Office',
            static::COUNSELLOR => 'Counsellor',
            static::PROCESSINGOFFICE => 'Processing Office',
            static::FRONTOFFICE => 'Front Office',
            static::ASSOCIATE => 'Associate'

        };
    }
}
