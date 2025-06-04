<?php

declare(strict_types=1);

namespace Database\Seeders;

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
        // User::factory(10)->create();

        Role::create([
            'name' => 'owner'
        ]);
        $tenant1 = Tenant::create();
        $tenant1->domains()->create(['domain' => 'foo.localhost']);

        Tenant::all()->runForEach(function () {
            User::factory()->create();
        });
    }
}
