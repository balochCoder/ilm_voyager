<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\TenantRolesEnum;
use App\Models\Role;
use Illuminate\Database\Seeder;

final class TenantDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Seed rep countries
        $this->call([
            RepCountrySeeder::class,
        ]);
    }
}
