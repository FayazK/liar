<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\PermissionService;
use Illuminate\Console\Command;

class SyncPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync permissions from config file to database';

    public function __construct(
        private readonly PermissionService $permissionService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Syncing permissions from config...');

        $stats = $this->permissionService->syncPermissionsFromConfig();

        $this->info("Created: {$stats['created']}");
        $this->info("Updated: {$stats['updated']}");
        $this->info("Deleted: {$stats['deleted']}");
        $this->info('Permissions synced successfully!');

        return self::SUCCESS;
    }
}
