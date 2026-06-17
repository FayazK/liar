<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\PageBuilder\Database\Seeders\Templates\ContactTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\ContentTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\CtaTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\FeatureTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\FooterTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\GalleryTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\HeaderTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\HeroTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\PricingTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\StatsTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\TeamTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\TemplateCategoryInterface;
use Modules\PageBuilder\Database\Seeders\Templates\TestimonialTemplates;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateSeeder extends Seeder
{
    /** @var list<class-string<TemplateCategoryInterface>> */
    private const CATEGORIES = [
        HeroTemplates::class,
        FeatureTemplates::class,
        PricingTemplates::class,
        TestimonialTemplates::class,
        CtaTemplates::class,
        ContentTemplates::class,
        GalleryTemplates::class,
        TeamTemplates::class,
        ContactTemplates::class,
        FooterTemplates::class,
        HeaderTemplates::class,
        StatsTemplates::class,
    ];

    public function run(): void
    {
        $templates = [];
        foreach (self::CATEGORIES as $categoryClass) {
            foreach ($categoryClass::templates() as $template) {
                if (isset($template['tags']) && is_array($template['tags'])) {
                    $template['tags'] = json_encode($template['tags']);
                }
                $templates[] = $template;
            }
        }

        SectionTemplate::upsert($templates, uniqueBy: ['slug'], update: [
            'name', 'category', 'tags', 'html_template', 'css_template',
            'is_active', 'is_custom', 'sort_order',
        ]);
    }
}
