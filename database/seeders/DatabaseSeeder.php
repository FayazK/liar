<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);

        $adminRole = Role::where('name', 'Admin')->first();

        User::firstOrCreate(
            ['email' => 'info@fayazk.com'],
            [
                'first_name' => 'Fayaz',
                'last_name' => 'K',
                'password' => Hash::make('@Password1'),
                'role_id' => $adminRole?->id,
                'timezone_id' => null,
                'language_id' => null,
                'is_active' => true,
            ]
        );
    }
}
