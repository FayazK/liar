<?php

declare(strict_types=1);

use Modules\PageBuilder\Models\SectionTemplate;

describe('SectionTemplate seeder', function () {
    it('seeds hero section templates', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);

        $heroTemplates = SectionTemplate::where('category', 'hero')->get();
        expect($heroTemplates->count())->toBeGreaterThanOrEqual(3);
    });

    it('seeds templates with valid HTML', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);

        $templates = SectionTemplate::all();
        expect($templates->count())->toBeGreaterThan(0);

        $templates->each(function (SectionTemplate $template) {
            expect($template->html_template)->not->toBeEmpty();
            expect($template->name)->not->toBeEmpty();
            expect($template->slug)->not->toBeEmpty();
            expect($template->category)->not->toBeEmpty();
        });
    });

    it('does not duplicate on re-run', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);
        $countFirst = SectionTemplate::count();

        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);
        $countSecond = SectionTemplate::count();

        expect($countSecond)->toBe($countFirst);
    });
});
