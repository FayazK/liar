<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RoleRepository
{
    public function find(int $id): ?Role
    {
        return Role::find($id);
    }

    public function findOrFail(int $id, array $with = []): Role
    {
        $query = Role::query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function getAll(): Collection
    {
        return Role::query()->orderBy('name')->get();
    }

    public function findByName(string $name): ?Role
    {
        return Role::where('name', $name)->first();
    }

    public function create(array $data): Role
    {
        return Role::create($data);
    }

    public function update(int $id, array $data): Role
    {
        $role = Role::findOrFail($id);
        $role->update($data);

        return $role->fresh();
    }

    public function delete(int $id): bool
    {
        $role = Role::findOrFail($id);

        return $role->delete();
    }

    /**
     * Find role with permissions eager loaded.
     */
    public function findWithPermissions(int $id): ?Role
    {
        return Role::query()->with('permissions')->find($id);
    }

    /**
     * Get all roles with permissions eager loaded.
     */
    public function getAllWithPermissions(): Collection
    {
        return Role::query()
            ->with('permissions')
            ->orderBy('name')
            ->get();
    }

    /**
     * Sync permissions for a role.
     */
    public function syncPermissions(Role $role, array $permissionIds): void
    {
        $role->syncPermissions($permissionIds);
    }

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator
    {
        $query = Role::query()->orderBy('name');

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->paginate($perPage);
    }
}
