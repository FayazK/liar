<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Laravel\Ai\Responses\AgentResponse;
use Laravel\Ai\Responses\StreamableAgentResponse;
use Modules\PageBuilder\Agents\ContentRewriterAgent;
use Modules\PageBuilder\Agents\PageGeneratorAgent;
use Modules\PageBuilder\Agents\SectionGeneratorAgent;
use Modules\PageBuilder\Agents\StyleSuggestionAgent;

class AiGenerationService
{
    public function __construct(
        private readonly BrandProfileService $brandProfileService,
    ) {}

    /**
     * Generate a section using the AI agent.
     *
     * Note: Returns a raw stream. HTML sanitization is not applied here for streamed
     * responses; instead, sanitization occurs at compilation time when the page is
     * published via PageCompilerService::compile().
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

    /**
     * Generate a full page by planning sections then generating each one.
     *
     * @return array<int, array{html: string, css: string, category: string}>
     */
    public function generatePage(string $prompt, int $maxSections = 6): array
    {
        $brandProfile = $this->brandProfileService->getActive();

        // Step 1: Plan the page layout
        $planner = new PageGeneratorAgent($brandProfile, $maxSections);
        $plan = $planner->prompt($prompt);
        $sections = $plan['sections'];

        // Step 2: Generate each section using SectionGeneratorAgent
        $results = [];
        foreach ($sections as $section) {
            $agent = new SectionGeneratorAgent($brandProfile, $section['category']);
            $response = $agent->prompt($section['description']);
            $html = PageCompilerService::sanitizeHtml($response['html']);
            $results[] = [
                'html' => $html,
                'css' => $response['css'],
                'category' => $section['category'],
            ];
        }

        return $results;
    }

    /**
     * Suggest style improvements for the given HTML and CSS.
     */
    public function suggestStyles(string $html, string $css): AgentResponse
    {
        $brandProfile = $this->brandProfileService->getActive();
        $agent = new StyleSuggestionAgent($brandProfile);

        return $agent->prompt("Page HTML:\n{$html}\n\nPage CSS:\n{$css}");
    }
}
