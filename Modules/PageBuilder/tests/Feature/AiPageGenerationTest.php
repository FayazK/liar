<?php

declare(strict_types=1);

use Modules\PageBuilder\Agents\PageGeneratorAgent;

describe('AI Page Generation', function () {
    it('plans page sections via the agent', function () {
        PageGeneratorAgent::fake([
            [
                'sections' => [
                    ['category' => 'hero', 'description' => 'A bold hero section'],
                    ['category' => 'features', 'description' => 'Key features grid'],
                    ['category' => 'cta', 'description' => 'Call to action'],
                ],
            ],
        ]);

        $agent = new PageGeneratorAgent(null, 6);
        $response = $agent->prompt('Create a landing page for a SaaS product');

        $sections = $response['sections'];
        expect($sections)->toHaveCount(3);
        expect($sections[0]['category'])->toBe('hero');

        PageGeneratorAgent::assertPrompted('Create a landing page for a SaaS product');
    });

    it('includes max sections in instructions', function () {
        $agent = new PageGeneratorAgent(null, 4);
        $instructions = $agent->instructions();

        expect((string) $instructions)->toContain('4');
    });
});
