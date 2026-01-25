<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

class RoleRepository
{
    public function find(int $id): ?Role
    {
        return Role::find($id);
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
}
