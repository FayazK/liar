<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\PageBuilder\Models\BrandProfile;

class BrandProfileFactory extends Factory
{
    protected $model = BrandProfile::class;

    public function definition(): array
    {
        return [
            'business_name' => $this->faker->company(),
            'industry' => $this->faker->randomElement(['Technology', 'Healthcare', 'Finance', 'Retail', 'Education']),
            'tone_of_voice' => $this->faker->randomElement(['friendly', 'professional', 'casual', 'authoritative', 'playful']),
            'target_audience' => $this->faker->sentence(),
            'color_palette' => [
                'primary' => $this->faker->hexColor(),
                'secondary' => $this->faker->hexColor(),
                'accent' => $this->faker->hexColor(),
            ],
            'font_preferences' => [
                'heading' => $this->faker->randomElement(['Inter', 'Roboto', 'Poppins', 'Playfair Display']),
                'body' => $this->faker->randomElement(['Inter', 'Roboto', 'Open Sans', 'Lato']),
            ],
            'brand_description' => $this->faker->paragraph(),
        ];
    }
}
