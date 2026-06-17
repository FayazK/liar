<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Illuminate\Support\Facades\Storage;
use Laravel\Ai\Image;

class AiImageService
{
    public function generate(string $prompt, string $aspect = 'landscape'): array
    {
        $pending = Image::of($prompt)
            ->timeout(config('page-builder.ai.timeout', 90));

        $pending = match ($aspect) {
            'portrait' => $pending->portrait(),
            'square' => $pending->square(),
            default => $pending->landscape(),
        };

        $response = $pending->generate();
        $path = $response->storePublicly();

        return [
            'url' => Storage::url((string) $path),
            'alt' => $prompt,
        ];
    }
}
