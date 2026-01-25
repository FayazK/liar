<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaService
{
    /**
     * Add media to a model from an uploaded file.
     */
    public function addMedia(HasMedia $model, UploadedFile $file, string $collection = 'default'): Media
    {
        return $model->addMedia($file)->toMediaCollection($collection);
    }

    /**
     * Clear all media from a collection.
     */
    public function clearCollection(HasMedia $model, string $collection): void
    {
        $model->clearMediaCollection($collection);
    }

    /**
     * Get the first media URL from a collection.
     */
    public function getFirstMediaUrl(HasMedia $model, string $collection, string $conversion = ''): ?string
    {
        return $model->getFirstMediaUrl($collection, $conversion) ?: null;
    }

    /**
     * Check if a model has media in a collection.
     */
    public function hasMedia(HasMedia $model, string $collection): bool
    {
        return $model->hasMedia($collection);
    }
}
