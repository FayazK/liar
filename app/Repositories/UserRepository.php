<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
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

    public function existsByEmail(string $email): bool
    {
        return User::where('email', $email)->exists();
    }
}