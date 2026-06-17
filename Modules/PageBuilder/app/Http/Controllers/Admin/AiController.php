<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Modules\PageBuilder\Http\Requests\GenerateImageRequest;
use Modules\PageBuilder\Http\Requests\GeneratePageRequest;
use Modules\PageBuilder\Http\Requests\GenerateSectionRequest;
use Modules\PageBuilder\Http\Requests\RewriteContentRequest;
use Modules\PageBuilder\Http\Requests\StyleSuggestionsRequest;
use Modules\PageBuilder\Services\AiGenerationService;
use Modules\PageBuilder\Services\AiImageService;

class AiController extends Controller
{
    public function __construct(
        private readonly AiGenerationService $aiGenerationService,
        private readonly AiImageService $aiImageService,
    ) {}

    public function generateSection(GenerateSectionRequest $request): mixed
    {
        return $this->aiGenerationService->generateSection(
            $request->string('prompt')->toString(),
            $request->string('category')->toString() ?: null,
        );
    }

    public function rewriteContent(RewriteContentRequest $request): mixed
    {
        return $this->aiGenerationService->rewriteContent(
            $request->string('original_text')->toString(),
            $request->string('instruction')->toString(),
        );
    }

    public function generatePage(GeneratePageRequest $request): JsonResponse
    {
        $sections = $this->aiGenerationService->generatePage(
            $request->string('prompt')->toString(),
            $request->integer('section_count', 6),
        );

        return response()->json([
            'success' => true,
            'data' => ['sections' => $sections],
        ]);
    }

    public function generateImage(GenerateImageRequest $request): JsonResponse
    {
        $result = $this->aiImageService->generate(
            $request->string('prompt')->toString(),
            $request->string('aspect', 'landscape')->toString(),
        );

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function styleSuggestions(StyleSuggestionsRequest $request): JsonResponse
    {
        $response = $this->aiGenerationService->suggestStyles(
            $request->string('html')->toString(),
            $request->string('css')->toString(),
        );

        return response()->json([
            'success' => true,
            'data' => ['suggestions' => $response['suggestions']],
        ]);
    }
}
