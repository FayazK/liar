<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Library\FileUploadRequest;
use App\Http\Requests\Library\LibraryFavoriteRequest;
use App\Http\Requests\Library\LibraryItemsRequest;
use App\Http\Requests\Library\LibraryMoveRequest;
use App\Http\Requests\Library\LibraryStoreRequest;
use App\Http\Requests\Library\LibraryUpdateRequest;
use App\Models\Library;
use App\Services\LibraryService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LibraryController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly LibraryService $service
    ) {}

    /**
     * Display the library index page.
     */
    public function index(?int $folder = null): Response
    {
        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $root = $this->service->ensureRootExists($userId);

        // If no folder specified, use root
        if ($folder === null) {
            $currentFolder = $root;
            $breadcrumbs = [];
        } else {
            $currentFolder = Library::findOrFail($folder);
            $this->authorize('view', $currentFolder);
            $breadcrumbs = $this->service->getBreadcrumbs($folder);
        }

        return Inertia::render('library/index', [
            'currentFolder' => $currentFolder,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    /**
     * Create a new folder.
     */
    public function store(LibraryStoreRequest $request): JsonResponse
    {
        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $library = $this->service->createFolder(
            $userId,
            $request->validated('name'),
            $request->validated('parent_id')
        );

        return response()->json([
            'message' => 'Folder created successfully',
            'data' => $library,
        ], 201);
    }

    /**
     * Update (rename) a folder.
     */
    public function update(int $id, LibraryUpdateRequest $request): JsonResponse
    {
        $library = Library::findOrFail($id);
        $this->authorize('update', $library);

        $library = $this->service->renameFolder($id, $request->validated('name'));

        return response()->json([
            'message' => 'Folder renamed successfully',
            'data' => $library,
        ]);
    }

    /**
     * Delete a folder.
     */
    public function destroy(int $id): JsonResponse
    {
        $library = Library::findOrFail($id);
        $this->authorize('delete', $library);

        $this->service->deleteFolder($id);

        return response()->json([
            'message' => 'Folder deleted successfully',
        ]);
    }

    /**
     * Upload files to a library.
     */
    public function uploadFiles(int $id, FileUploadRequest $request): JsonResponse
    {
        $library = Library::findOrFail($id);
        $this->authorize('uploadFiles', $library);

        $files = $request->file('files', []);
        $uploadedMedia = $this->service->uploadFiles($id, $files);

        return response()->json([
            'message' => count($uploadedMedia).' file(s) uploaded successfully',
            'data' => $uploadedMedia,
        ], 201);
    }

    /**
     * Download a file.
     */
    public function downloadFile(int $mediaId): StreamedResponse
    {
        $media = Media::findOrFail($mediaId);
        $library = $media->model;

        if (! $library instanceof Library) {
            abort(403);
        }

        $this->authorize('view', $library);

        return Storage::disk($media->disk)->download($media->getPath(), $media->file_name);
    }

    /**
     * Delete a file.
     */
    public function deleteFile(int $mediaId): JsonResponse
    {
        $media = Media::findOrFail($mediaId);
        $this->authorize('deleteFile', $media);

        $this->service->deleteFile($mediaId);

        return response()->json([
            'message' => 'File deleted successfully',
        ]);
    }

    /**
     * Move a file or folder.
     */
    public function move(LibraryMoveRequest $request): JsonResponse
    {
        $type = $request->validated('type');
        $itemId = $request->validated('item_id');
        $targetId = $request->validated('target_id');

        if ($type === 'file') {
            $media = $this->service->moveFile($itemId, $targetId);

            return response()->json([
                'message' => 'File moved successfully',
                'data' => $media,
            ]);
        }

        $library = $this->service->moveLibrary($itemId, $targetId);

        return response()->json([
            'message' => 'Folder moved successfully',
            'data' => $library,
        ]);
    }

    /**
     * Get all items (folders and files) for a library with sorting support.
     */
    public function getItems(int $id, LibraryItemsRequest $request): JsonResponse
    {
        $library = Library::findOrFail($id);
        $this->authorize('view', $library);

        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $sortBy = $request->validated('sort_by', 'name');
        $sortDir = $request->validated('sort_dir', 'asc');

        $items = $this->service->getItemsSorted($id, $userId, $sortBy, $sortDir);

        return response()->json($items);
    }

    /**
     * Get the folder tree for sidebar navigation.
     */
    public function getFolderTree(): JsonResponse
    {
        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $tree = $this->service->getFolderTree($userId);

        return response()->json($tree);
    }

    /**
     * Get children of a folder for lazy loading in tree.
     */
    public function getFolderChildren(int $id): JsonResponse
    {
        $library = Library::findOrFail($id);
        $this->authorize('view', $library);

        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $children = $this->service->getFolderChildren($userId, $id);

        return response()->json($children);
    }

    /**
     * Toggle favorite status on a file or folder.
     */
    public function toggleFavorite(LibraryFavoriteRequest $request): JsonResponse
    {
        $type = $request->validated('type');
        $id = $request->validated('id');

        // Authorize based on type
        if ($type === 'folder') {
            $library = Library::findOrFail($id);
            $this->authorize('update', $library);
        } else {
            $media = Media::findOrFail($id);
            $library = $media->model;

            if (! $library instanceof Library) {
                abort(403);
            }

            $this->authorize('view', $library);
        }

        $result = $this->service->toggleFavorite($type, $id);

        return response()->json([
            'message' => 'Favorite status updated',
            'is_favorite' => $result['is_favorite'],
        ]);
    }

    /**
     * Get quick access files (recent, favorites, by type).
     */
    public function getQuickAccessFiles(string $category, LibraryItemsRequest $request): JsonResponse
    {
        $userId = auth()->id();

        if (! $userId) {
            abort(401);
        }

        $validCategories = ['recent', 'favorites', 'documents', 'images', 'videos', 'audio', 'archives'];

        if (! in_array($category, $validCategories, true)) {
            abort(404, 'Invalid category');
        }

        $sortBy = $request->validated('sort_by', $category === 'recent' ? 'updated_at' : 'name');
        $sortDir = $request->validated('sort_dir', $category === 'recent' ? 'desc' : 'asc');
        $perPage = $request->validated('per_page', 50);

        $items = $this->service->getQuickAccessFiles($userId, $category, $sortBy, $sortDir, $perPage);

        return response()->json($items);
    }

    /**
     * Get thumbnail URL for a media item if it's an image.
     */
    private function getThumbnailUrl(Media $media): ?string
    {
        if (! str_starts_with($media->mime_type, 'image/')) {
            return null;
        }

        if ($media->hasGeneratedConversion('thumb')) {
            return $media->getUrl('thumb');
        }

        // Fallback to original URL for images without conversion
        return $media->getUrl();
    }
}
