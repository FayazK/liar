<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class PermissionService
{
    public function __construct(
        private readonly PermissionRepository $permissionRepository
    ) {}

    /**
     * Get all permissions grouped by module with caching.
     */
    public function getAllGroupedByModule(): Collection
    {
        return Cache::remember(
            'permissions_grouped_by_module',
            now()->addDay(),
            fn (): Collection => $this->permissionRepository->getAllGroupedByModule()
        );
    }

    /**
     * Sync permissions from config file.
     *
     * @return array{created: int, updated: int, deleted: int}
     */
    public function syncPermissionsFromConfig(): array
    {
        $stats = $this->permissionRepository->syncFromConfig();

        // Clear permission caches
        $this->clearAllCaches();

        return $stats;
    }

    /**
     * Clear all permission-related caches.
     */
    public function clearAllCaches(): void
    {
        Cache::forget('permissions_grouped_by_module');

        // Clear all user permission caches
        // Note: This is a simple approach. For production with many users,
        // consider using cache tags or a more targeted approach.
        Cache::flush();
    }
}
