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
     * Find the root library for a user.
     */
    public function findRoot(int $userId): ?Library
    {
        return Library::where('user_id', $userId)
            ->where('slug', Library::ROOT_SLUG)
            ->first();
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
     * Fetches all ancestors efficiently with a limit to prevent infinite loops.
     */
    public function getBreadcrumbs(int $libraryId): array
    {
        $library = Library::select('id', 'name', 'parent_id', 'slug')
            ->where('id', $libraryId)
            ->first();

        if (! $library || $library->slug === Library::ROOT_SLUG) {
            return [];
        }

        // First collect all parent IDs by traversing the tree (using only IDs)
        $ancestorIds = [];
        $currentId = $libraryId;
        $maxDepth = 50; // Safety limit to prevent infinite loops

        // Get parent chain IDs efficiently
        while ($currentId && $maxDepth-- > 0) {
            $parent = Library::select('id', 'parent_id', 'slug')
                ->where('id', $currentId)
                ->first();

            if (! $parent || $parent->slug === Library::ROOT_SLUG) {
                break;
            }

            $ancestorIds[] = $currentId;
            $currentId = $parent->parent_id;
        }

        if (empty($ancestorIds)) {
            return [];
        }

        // Fetch all ancestors in a single query
        $ancestors = Library::select('id', 'name', 'parent_id')
            ->whereIn('id', $ancestorIds)
            ->get()
            ->keyBy('id');

        // Build breadcrumbs in correct order (from root to current)
        $breadcrumbs = [];
        foreach (array_reverse($ancestorIds) as $id) {
            $ancestor = $ancestors->get($id);
            if ($ancestor) {
                $breadcrumbs[] = [
                    'id' => $ancestor->id,
                    'name' => $ancestor->name,
                    'parent_id' => $ancestor->parent_id,
                ];
            }
        }

        return $breadcrumbs;
    }

    /**
     * Check if a library is a descendant of another library.
     * Used for preventing circular references when moving folders.
     */
    public function isDescendantOf(int $potentialDescendantId, int $ancestorId): bool
    {
        $currentId = $potentialDescendantId;
        $maxDepth = 50; // Safety limit

        while ($currentId && $maxDepth-- > 0) {
            $library = Library::select('parent_id')
                ->where('id', $currentId)
                ->first();

            if (! $library || ! $library->parent_id) {
                return false;
            }

            if ($library->parent_id === $ancestorId) {
                return true;
            }

            $currentId = $library->parent_id;
        }

        return false;
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

    /**
     * Get all folders for the user as a flat list with hierarchy info.
     * Used for building the folder tree in the sidebar.
     *
     * @return Collection<int, Library>
     */
    public function getFolderTree(int $userId): Collection
    {
        return Library::where('user_id', $userId)
            ->where('slug', '!=', Library::ROOT_SLUG)
            ->withCount('children')
            ->withCount('media as file_count')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get immediate child folders for lazy loading in tree.
     *
     * @return Collection<int, Library>
     */
    public function getFolderChildren(int $userId, int $parentId): Collection
    {
        return Library::where('user_id', $userId)
            ->where('parent_id', $parentId)
            ->where('slug', '!=', Library::ROOT_SLUG)
            ->withCount('children')
            ->withCount('media as file_count')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get favorite folders for a user.
     *
     * @return Collection<int, Library>
     */
    public function getFavoriteFolders(
        int $userId,
        string $sortBy = 'name',
        string $sortDir = 'asc'
    ): Collection {
        return Library::where('user_id', $userId)
            ->where('is_favorite', true)
            ->where('slug', '!=', Library::ROOT_SLUG)
            ->withCount('media as file_count')
            ->orderBy($sortBy, $sortDir)
            ->get();
    }

    /**
     * Toggle favorite status on a folder.
     */
    public function toggleFavorite(int $libraryId): Library
    {
        $library = Library::findOrFail($libraryId);
        $library->update(['is_favorite' => ! $library->is_favorite]);

        return $library->fresh();
    }

    /**
     * Get children with sorting support.
     *
     * @return Collection<int, Library>
     */
    public function getChildrenSorted(
        int $userId,
        ?int $parentId,
        string $sortBy = 'name',
        string $sortDir = 'asc'
    ): Collection {
        $sortColumn = match ($sortBy) {
            'date', 'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            default => 'name',
        };

        return Library::where('user_id', $userId)
            ->where('parent_id', $parentId)
            ->where('slug', '!=', Library::ROOT_SLUG)
            ->withCount('media as file_count')
            ->orderBy($sortColumn, $sortDir)
            ->get();
    }
}
