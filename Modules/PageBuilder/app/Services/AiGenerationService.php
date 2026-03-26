<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Laravel\Ai\Responses\StreamableAgentResponse;
use Modules\PageBuilder\Agents\ContentRewriterAgent;
use Modules\PageBuilder\Agents\SectionGeneratorAgent;

class AiGenerationService
{
    public function __construct(
        private readonly BrandProfileService $brandProfileService,
    ) {}

    /**
     * Generate a section using the AI agent.
     */
    public function generateSection(string $prompt, ?string $category = null): StreamableAgentResponse
    {
        $brandProfile = $this->brandProfileService->getActive();
        $agent = new SectionGeneratorAgent($brandProfile, $category);

        return $agent->stream($prompt);
    }

    /**
     * Rewrite content using the AI agent.
     */
    public function rewriteContent(string $text, string $instruction): StreamableAgentResponse
    {
        $brandProfile = $this->brandProfileService->getActive();
        $agent = new ContentRewriterAgent($brandProfile);

        return $agent->stream("Original text:\n{$text}\n\nInstruction: {$instruction}");
    }
}
