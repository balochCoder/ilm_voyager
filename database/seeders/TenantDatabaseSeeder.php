<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Enums\TenantRolesEnum;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        Role::create([
            'name' => TenantRolesEnum::SUPERADMIN->value
        ]);
    }
}
