<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Library;
use App\Repositories\LibraryRepository;
use App\Repositories\MediaRepository;
use App\Support\Formatters;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class LibraryService
{
    public function __construct(
        private readonly LibraryRepository $repository,
        private readonly MediaRepository $mediaRepository,
        private readonly MediaService $mediaService
    ) {}

    /**
     * Ensure the root library exists for the user.
     */
    public function ensureRootExists(int $userId): Library
    {
        return $this->repository->getOrCreateRoot($userId);
    }

    /**
     * Create a new folder.
     */
    public function createFolder(int $userId, string $name, ?int $parentId): Library
    {
        $slug = $this->repository->generateUniqueSlug($userId, $parentId, $name);

        return $this->repository->create([
            'user_id' => $userId,
            'parent_id' => $parentId,
            'name' => $name,
            'slug' => $slug,
            'description' => null,
            'color' => null,
        ]);
    }

    /**
     * Rename a folder.
     */
    public function renameFolder(int $libraryId, string $newName): Library
    {
        $library = $this->repository->find($libraryId);

        if (! $library) {
            throw new \RuntimeException('Library not found');
        }

        $newSlug = $this->repository->generateUniqueSlug(
            $library->user_id,
            $library->parent_id,
            $newName
        );

        return $this->repository->update($libraryId, [
            'name' => $newName,
            'slug' => $newSlug,
        ]);
    }

    /**
     * Delete a folder and all its contents.
     */
    public function deleteFolder(int $libraryId): bool
    {
        $library = $this->repository->find($libraryId);

        if (! $library) {
            throw new \RuntimeException('Library not found');
        }

        if ($library->is_root) {
            throw new \RuntimeException('Cannot delete root library');
        }

        return $this->repository->delete($libraryId);
    }

    /**
     * Upload multiple files to a library.
     *
     * @param  array<UploadedFile>  $files
     * @return array<Media>
     */
    public function uploadFiles(int $libraryId, array $files): array
    {
        $library = $this->repository->find($libraryId);

        if (! $library) {
            throw new \RuntimeException('Library not found');
        }

        $uploadedMedia = [];

        foreach ($files as $file) {
            $media = $this->mediaService->addMedia($library, $file, 'files');
            $uploadedMedia[] = $media;
        }

        return $uploadedMedia;
    }

    /**
     * Delete a file.
     */
    public function deleteFile(int $mediaId): bool
    {
        $media = Media::find($mediaId);

        if (! $media) {
            throw new \RuntimeException('File not found');
        }

        return $media->delete();
    }

    /**
     * Move a file to a different library.
     */
    public function moveFile(int $mediaId, int $targetLibraryId): Media
    {
        $media = Media::findOrFail($mediaId);
        $targetLibrary = $this->repository->find($targetLibraryId);

        if (! $targetLibrary) {
            throw new \RuntimeException('Target library not found');
        }

        $media->model_id = $targetLibraryId;
        $media->save();

        return $media->fresh();
    }

    /**
     * Move a library to a new parent.
     */
    public function moveLibrary(int $libraryId, ?int $newParentId): Library
    {
        $library = $this->repository->find($libraryId);

        if (! $library) {
            throw new \RuntimeException('Library not found');
        }

        if ($library->is_root) {
            throw new \RuntimeException('Cannot move root library');
        }

        // Prevent moving a library into itself or its descendants
        if ($newParentId && $this->repository->isDescendantOf($newParentId, $libraryId)) {
            throw new \RuntimeException('Cannot move a library into its own descendant');
        }

        return $this->repository->moveToParent($libraryId, $newParentId);
    }

    /**
     * Get breadcrumbs for navigation.
     */
    public function getBreadcrumbs(int $libraryId): array
    {
        return $this->repository->getBreadcrumbs($libraryId);
    }

    /**
     * Get folder tree for sidebar navigation.
     *
     * @return array{tree: array<mixed>}
     */
    public function getFolderTree(int $userId): array
    {
        // Get root folder to use as the base parent
        $root = $this->repository->findRoot($userId);
        $rootId = $root?->id;

        $folders = $this->repository->getFolderTree($userId);

        // Build tree structure starting from root's children
        $tree = $this->buildTreeStructure($folders, $rootId);

        return ['tree' => $tree];
    }

    /**
     * Get children of a folder for lazy loading.
     *
     * @return array{children: array<mixed>}
     */
    public function getFolderChildren(int $userId, int $folderId): array
    {
        $children = $this->repository->getFolderChildren($userId, $folderId);

        return [
            'children' => $children->map(fn (Library $folder) => $this->formatFolderForTree($folder))->values()->all(),
        ];
    }

    /**
     * Toggle favorite on a folder or file.
     *
     * @return array{is_favorite: bool, type: string}
     */
    public function toggleFavorite(string $type, int $id): array
    {
        if ($type === 'folder') {
            $library = $this->repository->toggleFavorite($id);

            return [
                'type' => 'folder',
                'is_favorite' => $library->is_favorite,
            ];
        }

        $media = $this->mediaRepository->toggleFavorite($id);

        return [
            'type' => 'file',
            'is_favorite' => $media->getCustomProperty('is_favorite', false),
        ];
    }

    /**
     * Get quick access files by category.
     *
     * @return array{files: array<mixed>, folders?: array<mixed>, meta: array<string, mixed>}
     */
    public function getQuickAccessFiles(
        int $userId,
        string $category,
        string $sortBy = 'name',
        string $sortDir = 'asc',
        int $perPage = 50
    ): array {
        $result = match ($category) {
            'recent' => $this->getRecentItems($userId, $sortBy, $sortDir, $perPage),
            'favorites' => $this->getFavoriteItems($userId, $sortBy, $sortDir, $perPage),
            default => $this->getCategoryFiles($userId, $category, $sortBy, $sortDir, $perPage),
        };

        return $result;
    }

    /**
     * Get items for a folder with sorting.
     *
     * @return array{folders: array<mixed>, files: array<mixed>}
     */
    public function getItemsSorted(
        int $libraryId,
        int $userId,
        string $sortBy = 'name',
        string $sortDir = 'asc'
    ): array {
        $library = $this->repository->find($libraryId);

        if (! $library) {
            throw new \RuntimeException('Library not found');
        }

        // Get folders with sorting
        $folders = $this->repository->getChildrenSorted($userId, $libraryId, $sortBy, $sortDir);

        // Get files with sorting
        $mediaQuery = $library->media();

        $mediaSortColumn = match ($sortBy) {
            'size' => 'size',
            'type' => 'mime_type',
            'date', 'created_at' => 'created_at',
            'updated_at' => 'updated_at',
            default => 'name',
        };

        $files = $mediaQuery->orderBy($mediaSortColumn, $sortDir)->get();

        return [
            'folders' => $folders->map(fn (Library $folder) => $this->formatFolderForList($folder))->values()->all(),
            'files' => $files->map(fn (Media $media) => $this->mediaRepository->formatMediaItem($media))->values()->all(),
        ];
    }

    /**
     * Build tree structure from flat folder list.
     *
     * @return array<mixed>
     */
    private function buildTreeStructure($folders, ?int $parentId): array
    {
        $tree = [];

        foreach ($folders as $folder) {
            if ($folder->parent_id === $parentId) {
                $node = $this->formatFolderForTree($folder);
                $children = $this->buildTreeStructure($folders, $folder->id);

                if (! empty($children)) {
                    $node['children'] = $children;
                } elseif ($folder->children_count > 0) {
                    $node['children'] = null; // Has children but not loaded
                } else {
                    $node['children'] = []; // No children
                }

                $tree[] = $node;
            }
        }

        return $tree;
    }

    /**
     * Format a folder for tree display.
     */
    private function formatFolderForTree(Library $folder): array
    {
        return [
            'id' => $folder->id,
            'name' => $folder->name,
            'parent_id' => $folder->parent_id,
            'has_children' => ($folder->children_count ?? 0) > 0,
            'file_count' => $folder->file_count ?? 0,
            'is_favorite' => $folder->is_favorite,
            'color' => $folder->color,
        ];
    }

    /**
     * Format a folder for list display.
     */
    private function formatFolderForList(Library $folder): array
    {
        return [
            'id' => $folder->id,
            'type' => 'folder',
            'name' => $folder->name,
            'color' => $folder->color,
            'file_count' => $folder->file_count ?? 0,
            'total_size_human' => Formatters::bytes($folder->total_size ?? 0),
            'is_favorite' => $folder->is_favorite,
            'created_at' => $folder->created_at?->toIso8601String(),
            'updated_at' => $folder->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Get recent files and folders.
     */
    private function getRecentItems(int $userId, string $sortBy, string $sortDir, int $perPage): array
    {
        $files = $this->mediaRepository->getRecentFiles($userId, 30, $sortBy, $sortDir, $perPage);

        return [
            'files' => collect($files->items())->map(fn (Media $media) => $this->mediaRepository->formatMediaItem($media))->values()->all(),
            'meta' => [
                'current_page' => $files->currentPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total(),
            ],
        ];
    }

    /**
     * Get favorite files and folders.
     */
    private function getFavoriteItems(int $userId, string $sortBy, string $sortDir, int $perPage): array
    {
        $files = $this->mediaRepository->getFavoriteFiles($userId, $sortBy, $sortDir, $perPage);
        $folders = $this->repository->getFavoriteFolders($userId, $sortBy, $sortDir);

        return [
            'files' => collect($files->items())->map(fn (Media $media) => $this->mediaRepository->formatMediaItem($media))->values()->all(),
            'folders' => $folders->map(fn (Library $folder) => $this->formatFolderForList($folder))->values()->all(),
            'meta' => [
                'current_page' => $files->currentPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total() + $folders->count(),
            ],
        ];
    }

    /**
     * Get files by category (documents, images, videos, audio, archives).
     */
    private function getCategoryFiles(int $userId, string $category, string $sortBy, string $sortDir, int $perPage): array
    {
        $files = $this->mediaRepository->getFilesByCategory($userId, $category, $sortBy, $sortDir, $perPage);

        return [
            'files' => collect($files->items())->map(fn (Media $media) => $this->mediaRepository->formatMediaItem($media))->values()->all(),
            'meta' => [
                'current_page' => $files->currentPage(),
                'per_page' => $files->perPage(),
                'total' => $files->total(),
            ],
        ];
    }
}
