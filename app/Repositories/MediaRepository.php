<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Library;
use App\Support\FileTypeCategories;
use App\Support\Formatters;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaRepository
{
    /**
     * Get recent files for a user (across all folders).
     */
    public function getRecentFiles(
        int $userId,
        int $days = 30,
        string $sortBy = 'updated_at',
        string $sortDir = 'desc',
        int $perPage = 50
    ): LengthAwarePaginator {
        $cutoffDate = Carbon::now()->subDays($days);

        return $this->getBaseQuery($userId)
            ->where('media.created_at', '>=', $cutoffDate)
            ->orderBy($this->getSortColumn($sortBy), $sortDir)
            ->paginate($perPage);
    }

    /**
     * Get favorite files for a user.
     */
    public function getFavoriteFiles(
        int $userId,
        string $sortBy = 'name',
        string $sortDir = 'asc',
        int $perPage = 50
    ): LengthAwarePaginator {
        return $this->getBaseQuery($userId)
            ->whereJsonContains('media.custom_properties->is_favorite', true)
            ->orderBy($this->getSortColumn($sortBy), $sortDir)
            ->paginate($perPage);
    }

    /**
     * Get files by MIME type category.
     *
     * @param  array<string>|null  $mimeTypes  Exact MIME types to match
     * @param  string|null  $mimePrefix  MIME prefix like 'image/', 'video/'
     */
    public function getFilesByType(
        int $userId,
        ?array $mimeTypes = null,
        ?string $mimePrefix = null,
        string $sortBy = 'name',
        string $sortDir = 'asc',
        int $perPage = 50
    ): LengthAwarePaginator {
        $query = $this->getBaseQuery($userId);

        if ($mimePrefix !== null) {
            $query->where('media.mime_type', 'like', $mimePrefix.'%');
        } elseif ($mimeTypes !== null && count($mimeTypes) > 0) {
            $query->whereIn('media.mime_type', $mimeTypes);
        }

        return $query
            ->orderBy($this->getSortColumn($sortBy), $sortDir)
            ->paginate($perPage);
    }

    /**
     * Get files by category name.
     */
    public function getFilesByCategory(
        int $userId,
        string $category,
        string $sortBy = 'name',
        string $sortDir = 'asc',
        int $perPage = 50
    ): LengthAwarePaginator {
        return match ($category) {
            'documents' => $this->getFilesByType($userId, FileTypeCategories::DOCUMENTS, null, $sortBy, $sortDir, $perPage),
            'images' => $this->getFilesByType($userId, null, FileTypeCategories::IMAGE_PREFIX, $sortBy, $sortDir, $perPage),
            'videos' => $this->getFilesByType($userId, null, FileTypeCategories::VIDEO_PREFIX, $sortBy, $sortDir, $perPage),
            'audio' => $this->getFilesByType($userId, null, FileTypeCategories::AUDIO_PREFIX, $sortBy, $sortDir, $perPage),
            'archives' => $this->getFilesByType($userId, FileTypeCategories::ARCHIVES, null, $sortBy, $sortDir, $perPage),
            default => $this->getFilesByType($userId, [], null, $sortBy, $sortDir, $perPage),
        };
    }

    /**
     * Toggle favorite status on a file.
     */
    public function toggleFavorite(int $mediaId): Media
    {
        $media = Media::findOrFail($mediaId);
        $currentValue = $media->getCustomProperty('is_favorite', false);
        $media->setCustomProperty('is_favorite', ! $currentValue);
        $media->save();

        return $media;
    }

    /**
     * Get a media file with folder information.
     */
    public function getFileWithFolderInfo(int $mediaId): ?array
    {
        $media = Media::select('media.*')
            ->selectRaw('libraries.name as folder_name')
            ->selectRaw('libraries.id as folder_id')
            ->join('libraries', function ($join) {
                $join->on('media.model_id', '=', 'libraries.id')
                    ->where('media.model_type', '=', Library::class);
            })
            ->where('media.id', $mediaId)
            ->first();

        if (! $media) {
            return null;
        }

        return $this->formatMediaItem($media);
    }

    /**
     * Get base query for media files belonging to a user.
     */
    private function getBaseQuery(int $userId)
    {
        return Media::query()
            ->select([
                'media.id',
                'media.name',
                'media.file_name',
                'media.mime_type',
                'media.size',
                'media.custom_properties',
                'media.generated_conversions',
                'media.model_id',
                'media.created_at',
                'media.updated_at',
            ])
            ->selectRaw('libraries.name as folder_name')
            ->selectRaw('libraries.id as folder_id')
            ->join('libraries', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'libraries.id')
                    ->where('media.model_type', '=', Library::class)
                    ->where('libraries.user_id', '=', $userId);
            });
    }

    /**
     * Get the sort column name.
     */
    private function getSortColumn(string $sortBy): string
    {
        return match ($sortBy) {
            'name' => 'media.name',
            'size' => 'media.size',
            'type' => 'media.mime_type',
            'date', 'created_at' => 'media.created_at',
            'updated_at' => 'media.updated_at',
            default => 'media.name',
        };
    }

    /**
     * Format a media item for API response.
     */
    public function formatMediaItem(Media $media): array
    {
        $customProperties = $media->custom_properties ?? [];
        $generatedConversions = $media->generated_conversions ?? [];

        // Check if thumbnail exists
        $thumbnailUrl = null;
        if (isset($generatedConversions['thumb']) && $generatedConversions['thumb']) {
            $thumbnailUrl = $media->getUrl('thumb');
        }

        return [
            'id' => $media->id,
            'type' => 'file',
            'name' => $media->name ?: $media->file_name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'size_human' => Formatters::bytes($media->size),
            'is_favorite' => $customProperties['is_favorite'] ?? false,
            'folder_id' => $media->folder_id ?? $media->model_id,
            'folder_name' => $media->folder_name ?? null,
            'thumbnail_url' => $thumbnailUrl,
            'created_at' => $media->created_at?->toIso8601String(),
            'updated_at' => $media->updated_at?->toIso8601String(),
        ];
    }
}
