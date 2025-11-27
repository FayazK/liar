<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    /**
     * Seed 1000 demo users for testing.
     */
    public function run(): void
    {
        User::factory()
            ->count(1000)
            ->create();
    }
}
