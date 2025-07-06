<?php

use App\Enums\TenantRolesEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            DB::table('roles')->insert([

            [
                'id' => (string) Str::ulid(),
                'name' => TenantRolesEnum::PROCESSINGOFFICE->value,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        });
    }


};
