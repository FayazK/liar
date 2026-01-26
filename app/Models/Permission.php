<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = [
        'key',
        'title',
        'description',
        'module',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Get all permissions grouped by module.
     */
    public static function groupedByModule(): Collection
    {
        return self::query()
            ->orderBy('module')
            ->orderBy('title')
            ->get()
            ->groupBy('module');
    }

    /**
     * Find permission by key.
     */
    public static function findByKey(string $key): ?self
    {
        return self::query()->where('key', $key)->first();
    }

    /**
     * Check if permission key exists.
     */
    public static function keyExists(string $key): bool
    {
        return self::query()->where('key', $key)->exists();
    }
}
