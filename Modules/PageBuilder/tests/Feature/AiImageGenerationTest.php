<?php

declare(strict_types=1);

use Laravel\Ai\Image;
use Modules\PageBuilder\Http\Requests\GenerateImageRequest;
use Modules\PageBuilder\Services\AiImageService;

describe('AI Image Generation', function () {
    it('generates an image via the service', function () {
        Image::fake();

        $service = app(AiImageService::class);
        $result = $service->generate('A beautiful sunset over mountains', 'landscape');

        expect($result)->toHaveKeys(['url', 'alt']);
        expect($result['alt'])->toBe('A beautiful sunset over mountains');

        Image::assertGenerated(fn ($prompt) => str_contains($prompt->prompt, 'sunset'));
    });

    it('validates image generation request', function () {
        $request = new GenerateImageRequest;
        $rules = $request->rules();

        expect($rules['prompt'])->toContain('required');
        expect($rules['aspect'])->toContain('nullable');
    });
});
