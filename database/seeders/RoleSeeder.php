<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'name' => 'Admin',
            'description' => 'Administrator with full access to all features',
        ]);

        Role::create([
            'name' => 'User',
            'description' => 'Standard user with limited access',
        ]);
    }
}
