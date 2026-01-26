<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the users for the role.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the permissions for the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permissionKey): bool
    {
        return $this->permissions()->where('key', $permissionKey)->exists();
    }

    /**
     * Sync permissions for the role.
     */
    public function syncPermissions(array $permissionIds): void
    {
        $this->permissions()->sync($permissionIds);
        $this->clearPermissionCache();
    }

    /**
     * Get array of permission keys.
     */
    public function getPermissionKeys(): array
    {
        return $this->permissions()->pluck('key')->toArray();
    }

    /**
     * Clear permission cache for all users with this role.
     */
    public function clearPermissionCache(): void
    {
        $this->users()->each(function (User $user): void {
            $user->clearPermissionCache();
        });
    }
}
