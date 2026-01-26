<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Role;
use App\Repositories\RoleRepository;
use Illuminate\Database\Eloquent\Collection;

class RoleService
{
    public function __construct(
        private readonly RoleRepository $roleRepository
    ) {}

    /**
     * Get all roles.
     */
    public function getAllRoles(): Collection
    {
        return $this->roleRepository->getAll();
    }

    /**
     * Find role by ID.
     */
    public function findRole(int $id): ?Role
    {
        return $this->roleRepository->find($id);
    }

    /**
     * Find role with permissions.
     */
    public function findRoleWithPermissions(int $id): ?Role
    {
        return $this->roleRepository->findWithPermissions($id);
    }

    /**
     * Create a new role with permissions.
     */
    public function createRole(array $data): Role
    {
        $permissionIds = $data['permission_ids'] ?? [];
        unset($data['permission_ids']);

        $role = $this->roleRepository->create($data);

        if (! empty($permissionIds)) {
            $role->syncPermissions($permissionIds);
        }

        return $role;
    }

    /**
     * Update a role with permissions.
     */
    public function updateRole(int $id, array $data): Role
    {
        $permissionIds = $data['permission_ids'] ?? [];
        unset($data['permission_ids']);

        $role = $this->roleRepository->update($id, $data);

        $role->syncPermissions($permissionIds);

        return $role;
    }

    /**
     * Delete a role.
     */
    public function deleteRole(int $id): bool
    {
        return $this->roleRepository->delete($id);
    }
}
