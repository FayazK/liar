<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Library;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class LibraryRepository
{
    /**
     * Find a library by ID.
     */
    public function find(int $id): ?Library
    {
        return Library::find($id);
    }

    /**
     * Create a new library.
     */
    public function create(array $data): Library
    {
        return Library::create($data);
    }

    /**
     * Update an existing library.
     */
    public function update(int $id, array $data): Library
    {
        $library = Library::findOrFail($id);
        $library->update($data);

        return $library->fresh();
    }

    /**
     * Delete a library.
     */
    public function delete(int $id): bool
    {
        $library = Library::findOrFail($id);

        return $library->delete();
    }

    /**
     * Get or create the root library for a user.
     */
    public function getOrCreateRoot(int $userId): Library
    {
        return Library::firstOrCreate(
            [
                'user_id' => $userId,
                'slug' => Library::ROOT_SLUG,
            ],
            [
                'name' => 'Root',
                'parent_id' => null,
                'description' => null,
                'color' => null,
            ]
        );
    }

    /**
     * Get child libraries for a given parent.
     */
    public function getChildren(int $userId, ?int $parentId): Collection
    {
        return Library::where('user_id', $userId)
            ->where('parent_id', $parentId)
            ->where('slug', '!=', Library::ROOT_SLUG)
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get breadcrumbs for navigation.
     */
    public function getBreadcrumbs(int $libraryId): array
    {
        $breadcrumbs = [];
        $current = $this->find($libraryId);

        while ($current && $current->slug !== Library::ROOT_SLUG) {
            array_unshift($breadcrumbs, [
                'id' => $current->id,
                'name' => $current->name,
                'parent_id' => $current->parent_id,
            ]);
            $current = $current->parent;
        }

        return $breadcrumbs;
    }

    /**
     * Move a library to a new parent.
     */
    public function moveToParent(int $libraryId, ?int $newParentId): Library
    {
        $library = Library::findOrFail($libraryId);
        $library->update(['parent_id' => $newParentId]);

        return $library->fresh();
    }

    /**
     * Find library by user and slug.
     */
    public function findByUserAndSlug(int $userId, string $slug): ?Library
    {
        return Library::where('user_id', $userId)
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Generate a unique slug for a library.
     */
    public function generateUniqueSlug(int $userId, ?int $parentId, string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->slugExists($userId, $parentId, $slug)) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if a slug exists for the given user and parent.
     */
    private function slugExists(int $userId, ?int $parentId, string $slug): bool
    {
        return Library::where('user_id', $userId)
            ->where('parent_id', $parentId)
            ->where('slug', $slug)
            ->exists();
    }
}
