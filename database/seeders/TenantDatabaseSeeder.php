<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
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
            'name' => RolesEnum::SUPERADMIN->value
        ]);
    }
}
