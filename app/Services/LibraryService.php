<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Library;
use App\Repositories\LibraryRepository;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class LibraryService
{
    public function __construct(
        private readonly LibraryRepository $repository,
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
        if ($newParentId && $this->isDescendant($newParentId, $libraryId)) {
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
     * Check if a library is a descendant of another.
     */
    private function isDescendant(int $potentialDescendantId, int $ancestorId): bool
    {
        $current = $this->repository->find($potentialDescendantId);

        while ($current && $current->parent_id) {
            if ($current->parent_id === $ancestorId) {
                return true;
            }
            $current = $current->parent;
        }

        return false;
    }
}
