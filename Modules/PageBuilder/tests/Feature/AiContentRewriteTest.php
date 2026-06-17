<?php

declare(strict_types=1);

use Modules\PageBuilder\Agents\ContentRewriterAgent;
use Modules\PageBuilder\Http\Requests\RewriteContentRequest;
use Modules\PageBuilder\Models\BrandProfile;

describe('AI Content Rewrite', function () {
    it('rewrites text via the agent', function () {
        ContentRewriterAgent::fake([
            ['text' => 'Improved text here.'],
        ]);

        $agent = new ContentRewriterAgent(null);
        $response = $agent->prompt("Original text:\nHello world\n\nInstruction: Make it professional");

        expect($response['text'])->toBe('Improved text here.');

        ContentRewriterAgent::assertPrompted("Original text:\nHello world\n\nInstruction: Make it professional");
    });

    it('includes brand context when brand profile exists', function () {
        $brandProfile = BrandProfile::factory()->create([
            'business_name' => 'BrandCo',
        ]);

        $agent = new ContentRewriterAgent($brandProfile);
        $instructions = $agent->instructions();

        expect((string) $instructions)->toContain('BrandCo');
    });

    it('validates original_text and instruction are required', function () {
        $request = new RewriteContentRequest;
        $rules = $request->rules();

        expect($rules['original_text'])->toContain('required');
        expect($rules['instruction'])->toContain('required');
    });
});
