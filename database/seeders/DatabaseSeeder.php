<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'first_name' => 'Fayaz',
            'last_name' => 'K',
            'email' => 'info@fayazk.com',
            'password' => Hash::make('@Password1'),
            'timezone' => 'UTC',
            'locale' => 'en',
            'is_active' => true,
        ]);
    }
}
