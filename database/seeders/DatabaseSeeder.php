<?php

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
        $this->call(RoleSeeder::class);

        $adminRole = Role::where('name', 'Admin')->first();

        User::create([
            'first_name' => 'Fayaz',
            'last_name' => 'K',
            'email' => 'info@fayazk.com',
            'password' => Hash::make('@Password1'),
            'role_id' => $adminRole?->id,
            'timezone_id' => 0,
            'language_id' => 40,
            'is_active' => true,
        ]);
    }
}
