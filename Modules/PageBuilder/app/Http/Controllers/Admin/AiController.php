<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use Modules\PageBuilder\Http\Requests\GenerateSectionRequest;
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
}
