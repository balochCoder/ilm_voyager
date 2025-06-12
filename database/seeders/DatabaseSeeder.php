<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\CentralRolesEnum;
use App\Enums\TenantRolesEnum;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Raheel Ahmed',
            'email'=>'admin@ilmvoyager.com'
        ]);

        Role::create([
            'name' => 'owner'
        ]);

        $user->assignRole(CentralRolesEnum::OWNER->value);
        $tenant1 = Tenant::create([
            'name' => 'Mehmood',
            'website' => 'https://gen.com',
            'agency_name' => 'GEN',
            'email' => "info@gen.com",
            'password' => bcrypt('password'),
        ]);
        $tenant1->domains()->create(['domain' => 'gen' .'.'.config('app.domain')]);

        Tenant::all()->runForEach(function () {
            $user = User::factory()->create();
            $user->assignRole(TenantRolesEnum::SUPERADMIN->value);
        });
    }
}
