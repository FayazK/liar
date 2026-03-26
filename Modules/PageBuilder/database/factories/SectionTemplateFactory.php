<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateFactory extends Factory
{
    protected $model = SectionTemplate::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->unique()->slug(),
            'category' => $this->faker->randomElement(['hero', 'features', 'cta', 'content', 'pricing', 'testimonials']),
            'tags' => $this->faker->randomElements(['dark', 'light', 'minimal', 'bold', 'colorful'], 2),
            'html_template' => '<section>'.$this->faker->sentence().'</section>',
            'css_template' => '',
            'is_active' => true,
            'is_custom' => false,
            'sort_order' => 0,
        ];
    }
}
