<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Library extends Model implements HasMedia
{
    use InteractsWithMedia;

    public const string ROOT_SLUG = '__root__';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'parent_id',
        'name',
        'slug',
        'description',
        'color',
    ];

    /**
     * Boot the model and register event listeners.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (Library $library): void {
            // Delete all media files first
            $library->clearMediaCollection('files');

            // Recursively delete all children and their media
            foreach ($library->children as $child) {
                $child->delete();
            }
        });
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'is_root',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the library.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent library (folder).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Library::class, 'parent_id');
    }

    /**
     * Get the child libraries (subfolders).
     */
    public function children(): HasMany
    {
        return $this->hasMany(Library::class, 'parent_id');
    }

    /**
     * Scope to include media statistics.
     */
    public function scopeWithMediaStats($query)
    {
        return $query->withCount('media as file_count')
            ->withSum('media as total_size', 'size');
    }

    /**
     * Register media collections for the library.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('files')
            ->useDisk('local');
    }

    /**
     * Get the number of files in this library.
     */
    public function getFileCountAttribute(): int
    {
        // Use aggregated value if available, otherwise count
        return $this->attributes['file_count'] ?? $this->media()->count();
    }

    /**
     * Get the total size of all files in bytes.
     */
    public function getTotalSizeAttribute(): int
    {
        // Use aggregated value if available, otherwise sum
        return (int) ($this->attributes['total_size'] ?? $this->media()->sum('size'));
    }

    /**
     * Get the total size in human-readable format.
     */
    public function getTotalSizeHumanAttribute(): string
    {
        $bytes = $this->total_size;

        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        return round($bytes / (1024 ** $power), 2).' '.$units[(int) $power];
    }

    /**
     * Check if this is the root library.
     */
    public function getIsRootAttribute(): bool
    {
        return $this->slug === self::ROOT_SLUG;
    }
}
