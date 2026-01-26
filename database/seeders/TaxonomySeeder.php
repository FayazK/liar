<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Taxonomy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TaxonomySeeder extends Seeder
{
    public function run(): void
    {
        $taxonomies = [
            'post_categories' => [
                'Technology', 'Business', 'Lifestyle', 'Education',
            ],
            'product_tags' => [
                'Featured', 'Sale', 'New Arrival', 'Popular',
            ],
            'regions' => [
                'North America', 'Europe', 'Asia', 'Africa',
            ],
        ];

        foreach ($taxonomies as $type => $terms) {
            foreach ($terms as $term) {
                Taxonomy::firstOrCreate(
                    [
                        'type' => $type,
                        'slug' => Str::slug($term),
                    ],
                    [
                        'name' => $term,
                    ]
                );
            }
        }
    }
}
