<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PostRepository
{
    public function find(int $id): ?Post
    {
        return Post::find($id);
    }

    public function findOrFail(int $id, array $with = []): Post
    {
        $query = Post::query();

        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function findBySlugAndType(string $slug, PostType|string $type): ?Post
    {
        $typeValue = $type instanceof PostType ? $type->value : $type;

        return Post::query()
            ->where('slug', $slug)
            ->where('type', $typeValue)
            ->first();
    }

    /**
     * Get all posts of a specific type.
     */
    public function getAllByType(PostType|string $type): Collection
    {
        $typeValue = $type instanceof PostType ? $type->value : $type;

        return Post::query()
            ->where('type', $typeValue)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get published posts of a specific type.
     */
    public function getPublishedByType(PostType|string $type, int $limit = 10): Collection
    {
        $typeValue = $type instanceof PostType ? $type->value : $type;

        return Post::query()
            ->where('type', $typeValue)
            ->published()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function update(int $id, array $data): Post
    {
        $post = Post::findOrFail($id);
        $post->update($data);

        return $post->fresh();
    }

    public function delete(int $id): bool
    {
        $post = Post::findOrFail($id);

        return $post->delete();
    }

    public function forceDelete(int $id): bool
    {
        $post = Post::withTrashed()->findOrFail($id);

        return $post->forceDelete();
    }

    public function restore(int $id): Post
    {
        $post = Post::withTrashed()->findOrFail($id);
        $post->restore();

        return $post->fresh();
    }

    /**
     * Paginate posts with optional filters.
     */
    public function paginate(
        int $perPage = 15,
        array $with = [],
        ?PostType $type = null,
        ?PostStatus $status = null,
        ?int $authorId = null
    ): LengthAwarePaginator {
        $query = Post::query()->orderBy('created_at', 'desc');

        if (! empty($with)) {
            $query->with($with);
        }

        if ($type !== null) {
            $query->where('type', $type->value);
        }

        if ($status !== null) {
            $query->where('status', $status->value);
        }

        if ($authorId !== null) {
            $query->where('author_id', $authorId);
        }

        return $query->paginate($perPage);
    }

    /**
     * Check if a slug exists for a given type.
     */
    public function slugExists(string $slug, PostType|string $type, ?int $excludeId = null): bool
    {
        $typeValue = $type instanceof PostType ? $type->value : $type;

        $query = Post::query()
            ->where('slug', $slug)
            ->where('type', $typeValue);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get posts by author.
     */
    public function getByAuthor(int $authorId, ?PostType $type = null): Collection
    {
        $query = Post::query()->where('author_id', $authorId);

        if ($type !== null) {
            $query->where('type', $type->value);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
