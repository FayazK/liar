<?php

declare(strict_types=1);

use Modules\PageBuilder\Agents\SectionGeneratorAgent;
use Modules\PageBuilder\Http\Requests\GenerateSectionRequest;
use Modules\PageBuilder\Models\BrandProfile;

describe('AI Section Generation', function () {
    it('generates a section via the agent', function () {
        SectionGeneratorAgent::fake([
            ['html' => '<section class="pb-test"><h1>Test</h1></section>', 'css' => '.pb-test { color: red; }'],
        ]);

        $agent = new SectionGeneratorAgent(null, 'hero');
        $response = $agent->prompt('Create a hero section');

        expect($response['html'])->toContain('pb-test');
        expect($response['css'])->toContain('.pb-test');

        SectionGeneratorAgent::assertPrompted('Create a hero section');
    });

    it('includes brand context in instructions when brand profile exists', function () {
        $brandProfile = BrandProfile::factory()->create([
            'business_name' => 'TestCo',
        ]);

        $agent = new SectionGeneratorAgent($brandProfile, 'hero');
        $instructions = $agent->instructions();

        expect((string) $instructions)->toContain('TestCo');
    });

    it('includes category in instructions when provided', function () {
        $agent = new SectionGeneratorAgent(null, 'pricing');
        $instructions = $agent->instructions();

        expect((string) $instructions)->toContain('pricing');
    });

    it('validates prompt is required for section generation request', function () {
        $request = new GenerateSectionRequest;
        $rules = $request->rules();

        expect($rules['prompt'])->toContain('required');
        expect($rules['category'])->toContain('nullable');
    });
});
