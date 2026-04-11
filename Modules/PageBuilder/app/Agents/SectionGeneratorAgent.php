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

class SectionGeneratorAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(
        private readonly ?BrandProfile $brandProfile = null,
        private readonly ?string $category = null,
    ) {}

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return view('page-builder::prompts.section-generator', [
            'brandProfile' => $this->brandProfile,
            'category' => $this->category,
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
            'html' => $schema->string()->required(),
            'css' => $schema->string()->required(),
        ];
    }
}
