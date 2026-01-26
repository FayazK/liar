<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Services\PermissionService;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function __construct(
        private readonly PermissionService $permissionService
    ) {}

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Syncing permissions from config...');

        $stats = $this->permissionService->syncPermissionsFromConfig();

        $this->command->info("Created: {$stats['created']}");
        $this->command->info("Updated: {$stats['updated']}");
        $this->command->info("Deleted: {$stats['deleted']}");
        $this->command->info('Permissions synced successfully!');
    }
}
