<?php

declare(strict_types=1);

namespace App\Support;

final class Formatters
{
    /**
     * Format bytes to human-readable string.
     */
    public static function bytes(int $bytes, int $precision = 2): string
    {
        if ($bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = (int) floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        return round($bytes / (1024 ** $power), $precision).' '.$units[$power];
    }
}
