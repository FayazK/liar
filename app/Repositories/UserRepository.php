<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);

        return $user->fresh();
    }

    public function delete(int $id): bool
    {
        $user = User::findOrFail($id);

        return $user->delete();
    }

    public function updateLastLogin(int $id): User
    {
        $user = User::findOrFail($id);
        $user->update(['last_login_at' => now()]);

        return $user->fresh();
    }

    public function getActiveUsers(): Collection
    {
        return User::where('is_active', true)->get();
    }

    public function paginateUsers(
        int $perPage = 15,
        ?string $search = null,
        ?array $filters = null,
        ?string $sortBy = 'created_at',
        string $sortDirection = 'desc'
    ): LengthAwarePaginator {
        $query = User::query()->with('role');

        // Apply search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply filters
        if ($filters) {
            foreach ($filters as $column => $value) {
                if ($value !== null && $value !== '') {
                    if ($column === 'is_active') {
                        $query->where('is_active', (bool) $value);
                    } elseif ($column === 'created_at') {
                        // Handle date range filters
                        if (is_array($value) && count($value) === 2) {
                            $query->whereBetween('created_at', $value);
                        }
                    } else {
                        $query->where($column, $value);
                    }
                }
            }
        }

        // Apply sorting
        $allowedSortColumns = ['first_name', 'last_name', 'email', 'created_at', 'last_login_at', 'is_active'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        return $query->paginate($perPage);
    }

    public function existsByEmail(string $email): bool
    {
        return User::where('email', $email)->exists();
    }
}
