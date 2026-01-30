<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Repositories\PostRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PostService
{
    public function __construct(
        private readonly PostRepository $postRepository
    ) {}

    /**
     * Get all posts of a specific type.
     */
    public function getAllByType(PostType|string $type): Collection
    {
        return $this->postRepository->getAllByType($type);
    }

    /**
     * Find post by ID.
     */
    public function findPost(int $id): ?Post
    {
        return $this->postRepository->find($id);
    }

    /**
     * Find post by ID with relationships.
     */
    public function findPostWithRelations(int $id, array $with = ['author', 'taxonomies']): ?Post
    {
        return $this->postRepository->findOrFail($id, $with);
    }

    /**
     * Find post by slug and type.
     */
    public function findBySlugAndType(string $slug, PostType|string $type): ?Post
    {
        return $this->postRepository->findBySlugAndType($slug, $type);
    }

    /**
     * Create a new post.
     */
    public function createPost(array $data, PostType $type): Post
    {
        // Ensure type is set
        $data['type'] = $type->value;

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $type);
        } else {
            $data['slug'] = $this->ensureUniqueSlug($data['slug'], $type);
        }

        // Set default status if not provided
        if (empty($data['status'])) {
            $data['status'] = config('post_types.default_status', PostStatus::Draft->value);
        }

        // Auto-assign current user as author if not provided
        if (empty($data['author_id'])) {
            $data['author_id'] = auth()->id();
        }

        // Handle published_at for published posts
        if ($data['status'] === PostStatus::Published->value && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Extract taxonomy IDs for later
        $categoryIds = $data['category_ids'] ?? [];
        $tagIds = $data['tag_ids'] ?? [];
        $featuredImage = $data['featured_image'] ?? null;

        unset($data['category_ids'], $data['tag_ids'], $data['featured_image']);

        // Create the post
        $post = $this->postRepository->create($data);

        // Sync taxonomies if the type supports them
        $this->syncTaxonomies($post, $categoryIds, $tagIds);

        // Handle featured image
        if ($featuredImage !== null) {
            $this->setFeaturedImage($post, $featuredImage);
        }

        return $post;
    }

    /**
     * Update a post.
     */
    public function updatePost(int $id, array $data): Post
    {
        $post = $this->postRepository->findOrFail($id);

        // Handle slug update
        if (isset($data['slug']) && $data['slug'] !== $post->slug) {
            $data['slug'] = $this->ensureUniqueSlug($data['slug'], $post->type, $id);
        }

        // Handle published_at when status changes to published
        if (
            isset($data['status'])
            && $data['status'] === PostStatus::Published->value
            && $post->status !== PostStatus::Published
            && empty($data['published_at'])
        ) {
            $data['published_at'] = now();
        }

        // Extract taxonomy IDs
        $categoryIds = $data['category_ids'] ?? null;
        $tagIds = $data['tag_ids'] ?? null;
        $featuredImage = $data['featured_image'] ?? null;
        $removeFeaturedImage = $data['remove_featured_image'] ?? false;

        unset($data['category_ids'], $data['tag_ids'], $data['featured_image'], $data['remove_featured_image']);

        // Update the post
        $post = $this->postRepository->update($id, $data);

        // Sync taxonomies if provided
        if ($categoryIds !== null || $tagIds !== null) {
            $this->syncTaxonomies(
                $post,
                $categoryIds ?? [],
                $tagIds ?? []
            );
        }

        // Handle featured image
        if ($removeFeaturedImage) {
            $post->clearMediaCollection('featured_image');
        } elseif ($featuredImage !== null) {
            $this->setFeaturedImage($post, $featuredImage);
        }

        return $post->fresh(['author', 'taxonomies', 'media']);
    }

    /**
     * Delete a post.
     */
    public function deletePost(int $id): bool
    {
        return $this->postRepository->delete($id);
    }

    /**
     * Generate a unique slug from a title.
     */
    public function generateUniqueSlug(string $title, PostType|string $type, ?int $excludeId = null): string
    {
        $baseSlug = Str::slug($title);
        $maxLength = config('post_types.slugs.max_length', 255);
        $baseSlug = Str::limit($baseSlug, $maxLength - 10, '');

        return $this->ensureUniqueSlug($baseSlug, $type, $excludeId);
    }

    /**
     * Ensure a slug is unique by appending a number if necessary.
     */
    public function ensureUniqueSlug(string $slug, PostType|string $type, ?int $excludeId = null): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while ($this->postRepository->slugExists($slug, $type, $excludeId)) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Sync taxonomies for a post.
     */
    private function syncTaxonomies(Post $post, array $categoryIds, array $tagIds): void
    {
        $typeConfig = config("post_types.types.{$post->type->value}", []);
        $supports = $typeConfig['supports'] ?? [];

        // Combine all taxonomy IDs to sync
        $taxonomyIds = [];

        if (in_array('categories', $supports, true)) {
            $taxonomyIds = array_merge($taxonomyIds, $categoryIds);
        }

        if (in_array('tags', $supports, true)) {
            $taxonomyIds = array_merge($taxonomyIds, $tagIds);
        }

        // Sync all taxonomies at once
        $post->syncTaxonomies($taxonomyIds);
    }

    /**
     * Set the featured image for a post.
     */
    private function setFeaturedImage(Post $post, UploadedFile|string $image): void
    {
        if ($image instanceof UploadedFile) {
            $post->addMedia($image)
                ->toMediaCollection('featured_image');
        } elseif (is_string($image) && filter_var($image, FILTER_VALIDATE_URL)) {
            $post->addMediaFromUrl($image)
                ->toMediaCollection('featured_image');
        }
    }

    /**
     * Publish a post.
     */
    public function publishPost(int $id): Post
    {
        return $this->updatePost($id, [
            'status' => PostStatus::Published->value,
            'published_at' => now(),
        ]);
    }

    /**
     * Unpublish a post (set to draft).
     */
    public function unpublishPost(int $id): Post
    {
        return $this->updatePost($id, [
            'status' => PostStatus::Draft->value,
        ]);
    }

    /**
     * Archive a post.
     */
    public function archivePost(int $id): Post
    {
        return $this->updatePost($id, [
            'status' => PostStatus::Archived->value,
        ]);
    }
}
