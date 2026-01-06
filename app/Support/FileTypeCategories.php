<?php

declare(strict_types=1);

namespace App\Support;

/**
 * MIME type categories for library file filtering.
 */
final class FileTypeCategories
{
    /**
     * Document MIME types (PDF, Word, Excel, PowerPoint, text files).
     *
     * @var array<string>
     */
    public const array DOCUMENTS = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'text/rtf',
        'application/rtf',
    ];

    /**
     * Archive MIME types (zip, rar, 7z, tar, gzip).
     *
     * @var array<string>
     */
    public const array ARCHIVES = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/vnd.rar',
        'application/x-7z-compressed',
        'application/gzip',
        'application/x-gzip',
        'application/x-tar',
        'application/x-bzip2',
    ];

    /**
     * Image MIME type prefix for prefix matching.
     */
    public const string IMAGE_PREFIX = 'image/';

    /**
     * Video MIME type prefix for prefix matching.
     */
    public const string VIDEO_PREFIX = 'video/';

    /**
     * Audio MIME type prefix for prefix matching.
     */
    public const string AUDIO_PREFIX = 'audio/';

    /**
     * Get the category for a given MIME type.
     */
    public static function getCategoryForMimeType(string $mimeType): ?string
    {
        if (str_starts_with($mimeType, self::IMAGE_PREFIX)) {
            return 'images';
        }

        if (str_starts_with($mimeType, self::VIDEO_PREFIX)) {
            return 'videos';
        }

        if (str_starts_with($mimeType, self::AUDIO_PREFIX)) {
            return 'audio';
        }

        if (in_array($mimeType, self::DOCUMENTS, true)) {
            return 'documents';
        }

        if (in_array($mimeType, self::ARCHIVES, true)) {
            return 'archives';
        }

        return null;
    }

    /**
     * Check if a MIME type belongs to a category.
     */
    public static function isInCategory(string $mimeType, string $category): bool
    {
        return match ($category) {
            'images' => str_starts_with($mimeType, self::IMAGE_PREFIX),
            'videos' => str_starts_with($mimeType, self::VIDEO_PREFIX),
            'audio' => str_starts_with($mimeType, self::AUDIO_PREFIX),
            'documents' => in_array($mimeType, self::DOCUMENTS, true),
            'archives' => in_array($mimeType, self::ARCHIVES, true),
            default => false,
        };
    }
}
