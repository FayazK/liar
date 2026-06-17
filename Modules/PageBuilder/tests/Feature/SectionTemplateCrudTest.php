<?php

declare(strict_types=1);

use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Repositories\SectionTemplateRepositoryInterface;
use Modules\PageBuilder\Services\SectionTemplateService;

describe('SectionTemplateRepository', function () {
    it('creates a custom template', function () {
        $repo = app(SectionTemplateRepositoryInterface::class);

        $template = $repo->create([
            'name' => 'My Custom Hero',
            'slug' => 'my-custom-hero',
            'category' => 'hero',
            'tags' => ['dark', 'minimal'],
            'html_template' => '<section>Custom hero</section>',
            'css_template' => '',
            'is_custom' => true,
        ]);

        expect($template)->toBeInstanceOf(SectionTemplate::class);
        expect($template->name)->toBe('My Custom Hero');
        expect($template->is_custom)->toBeTrue();
        expect($template->tags)->toBe(['dark', 'minimal']);
    });

    it('lists templates filtered by tag', function () {
        SectionTemplate::factory()->create(['tags' => ['dark', 'minimal'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['colorful'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['dark', 'bold'], 'is_active' => true]);

        $repo = app(SectionTemplateRepositoryInterface::class);
        $results = $repo->getByTag('dark');

        expect($results)->toHaveCount(2);
    });

    it('updates a template', function () {
        $template = SectionTemplate::factory()->create(['name' => 'Old Name']);
        $repo = app(SectionTemplateRepositoryInterface::class);

        $updated = $repo->update($template->id, ['name' => 'New Name']);

        expect($updated->name)->toBe('New Name');
    });

    it('deletes a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);
        $repo = app(SectionTemplateRepositoryInterface::class);

        $repo->delete($template->id);

        expect(SectionTemplate::find($template->id))->toBeNull();
    });
});

describe('SectionTemplateService', function () {
    it('returns all unique tags from active templates', function () {
        SectionTemplate::factory()->create(['tags' => ['dark', 'minimal'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['dark', 'bold'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['colorful'], 'is_active' => true]);

        $service = app(SectionTemplateService::class);
        $tags = $service->getAllTags();

        expect($tags)->toContain('dark', 'minimal', 'bold', 'colorful');
        expect(count($tags))->toBe(4);
    });

    it('groups templates by category with tag filtering', function () {
        SectionTemplate::factory()->create(['category' => 'hero', 'tags' => ['dark'], 'is_active' => true]);
        SectionTemplate::factory()->create(['category' => 'hero', 'tags' => ['light'], 'is_active' => true]);
        SectionTemplate::factory()->create(['category' => 'cta', 'tags' => ['dark'], 'is_active' => true]);

        $service = app(SectionTemplateService::class);
        $grouped = $service->getGroupedByCategory(tag: 'dark');

        expect($grouped)->toHaveKey('hero');
        expect($grouped)->toHaveKey('cta');
        expect($grouped['hero'])->toHaveCount(1);
    });

    it('creates custom template from editor data', function () {
        $service = app(SectionTemplateService::class);

        $template = $service->createFromEditor(
            name: 'My Custom Section',
            category: 'hero',
            htmlTemplate: '<section>Custom</section>',
            cssTemplate: '.custom { color: red; }',
            tags: ['custom', 'dark'],
        );

        expect($template->is_custom)->toBeTrue();
        expect($template->slug)->toStartWith('my-custom-section');
        expect($template->tags)->toBe(['custom', 'dark']);
    });
});
