<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Modules\PageBuilder\Models\BrandProfile;
use Stringable;

class StyleSuggestionAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(
        private readonly ?BrandProfile $brandProfile = null,
    ) {}

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return view('page-builder::prompts.style-suggestion', [
            'brandProfile' => $this->brandProfile,
        ])->render();
    }

    /**
     * Get the agent's structured output schema definition.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'suggestions' => $schema->array()->items(
                $schema->object([
                    'title' => $schema->string()->required(),
                    'description' => $schema->string()->required(),
                    'target_selector' => $schema->string()->required(),
                    'css_changes' => $schema->object()->required(),
                ])
            )->required(),
        ];
    }
}
