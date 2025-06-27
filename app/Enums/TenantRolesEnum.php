<?php

declare(strict_types=1);

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
            self::SUPERADMIN => 'Super Admin',
            self::BRANCHOFFICE => 'Branch Office',
            self::COUNSELLOR => 'Counsellor',
            self::PROCESSINGOFFICE => 'Processing Office',
            self::FRONTOFFICE => 'Front Office',
            self::ASSOCIATE => 'Associate'
        };
    }
}
