<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\PageBuilder\Http\Requests\GenerateSectionRequest;
use Modules\PageBuilder\Http\Requests\RewriteContentRequest;
use Modules\PageBuilder\Services\AiGenerationService;

class AiController
{
    public function __construct(
        private readonly AiGenerationService $aiGenerationService,
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

    public function styleSuggestions(Request $request): JsonResponse
    {
        $request->validate([
            'html' => ['required', 'string'],
            'css' => ['nullable', 'string'],
        ]);

        $response = $this->aiGenerationService->suggestStyles(
            $request->string('html')->toString(),
            $request->string('css')->toString(),
        );

        return response()->json([
            'success' => true,
            'data' => $response->json(),
        ]);
    }
}
