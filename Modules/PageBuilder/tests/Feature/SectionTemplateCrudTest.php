<?php

declare(strict_types=1);

use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Repositories\SectionTemplateRepositoryInterface;

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
