<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

class PermissionRepository
{
    /**
     * Get all permissions.
     */
    public function getAll(): Collection
    {
        return Permission::query()
            ->orderBy('module')
            ->orderBy('title')
            ->get();
    }

    /**
     * Get all permissions grouped by module.
     */
    public function getAllGroupedByModule(): Collection
    {
        return Permission::groupedByModule();
    }

    /**
     * Find permission by key.
     */
    public function findByKey(string $key): ?Permission
    {
        return Permission::findByKey($key);
    }

    /**
     * Sync permissions from config file.
     *
     * @return array{created: int, updated: int, deleted: int}
     */
    public function syncFromConfig(): array
    {
        $configPermissions = config('permissions', []);
        $stats = ['created' => 0, 'updated' => 0, 'deleted' => 0];

        $configKeys = [];

        foreach ($configPermissions as $module => $permissions) {
            foreach ($permissions as $key => $data) {
                $configKeys[] = $key;

                $permission = Permission::query()->firstOrNew(['key' => $key]);

                if ($permission->exists) {
                    $permission->update([
                        'title' => $data['title'],
                        'description' => $data['description'] ?? null,
                        'module' => $module,
                    ]);
                    $stats['updated']++;
                } else {
                    $permission->fill([
                        'title' => $data['title'],
                        'description' => $data['description'] ?? null,
                        'module' => $module,
                    ]);
                    $permission->save();
                    $stats['created']++;
                }
            }
        }

        // Delete permissions not in config
        $deleted = Permission::query()
            ->whereNotIn('key', $configKeys)
            ->delete();

        $stats['deleted'] = $deleted;

        return $stats;
    }
}
