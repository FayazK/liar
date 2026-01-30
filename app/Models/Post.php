<?php

declare(strict_types=1);

namespace App\Models;

use Aliziodev\LaravelTaxonomy\Traits\HasTaxonomy;
use App\Enums\PostStatus;
use App\Enums\PostType;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Post extends Model implements HasMedia
{
    /** @use HasFactory<PostFactory> */
    use HasFactory;

    use HasTaxonomy;
    use InteractsWithMedia;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'type',
        'title',
        'slug',
        'content',
        'excerpt',
        'status',
        'author_id',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'featured_image_url',
        'featured_image_thumb_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PostType::class,
            'status' => PostStatus::class,
            'content' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Get the author of the post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Register media collections for the post.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    }

    /**
     * Register media conversions for thumbnails.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 400, 300)
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->fit(Fit::Contain, 800, 600)
            ->nonQueued();
    }

    /**
     * Get the post's featured image URL.
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('featured_image') ?: null;
    }

    /**
     * Get the post's featured image thumbnail URL.
     */
    public function getFeaturedImageThumbUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('featured_image', 'thumb') ?: null;
    }

    /**
     * Get the post type configuration.
     *
     * @return array<string, mixed>
     */
    public function getTypeConfig(): array
    {
        return config("post_types.types.{$this->type->value}", []);
    }

    /**
     * Check if the post type supports a feature.
     */
    public function supports(string $feature): bool
    {
        $config = $this->getTypeConfig();
        $supports = $config['supports'] ?? [];

        return in_array($feature, $supports, true);
    }

    /**
     * Get the categories for the post.
     */
    public function categories(): Collection
    {
        return $this->taxonomiesOfType('post_categories');
    }

    /**
     * Get the tags for the post.
     */
    public function tags(): Collection
    {
        return $this->taxonomiesOfType('post_tags');
    }

    /**
     * Scope a query to only include posts of a given type.
     */
    public function scopeOfType(Builder $query, PostType|string $type): Builder
    {
        $typeValue = $type instanceof PostType ? $type->value : $type;

        return $query->where('type', $typeValue);
    }

    /**
     * Scope a query to only include posts with a given status.
     */
    public function scopeOfStatus(Builder $query, PostStatus|string $status): Builder
    {
        $statusValue = $status instanceof PostStatus ? $status->value : $status;

        return $query->where('status', $statusValue);
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include draft posts.
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Draft);
    }

    /**
     * Scope a query to only include posts by a specific author.
     */
    public function scopeByAuthor(Builder $query, int $authorId): Builder
    {
        return $query->where('author_id', $authorId);
    }

    /**
     * Check if the post is published.
     */
    public function isPublished(): bool
    {
        return $this->status === PostStatus::Published
            && $this->published_at !== null
            && $this->published_at->isPast();
    }

    /**
     * Check if the post is a draft.
     */
    public function isDraft(): bool
    {
        return $this->status === PostStatus::Draft;
    }
}
