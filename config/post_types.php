<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Post Types Configuration
    |--------------------------------------------------------------------------
    |
    | Define all post types and their supported features.
    | Each type can have different capabilities enabled.
    |
    | Available features:
    | - categories: Hierarchical taxonomy support (post_categories)
    | - tags: Flat taxonomy support (post_tags)
    | - featured_image: Featured image via Spatie MediaLibrary
    | - excerpt: Short description/summary
    | - seo: Meta title, meta description, custom slug
    | - author: Author attribution and filtering
    |
    */

    'types' => [
        'blog_post' => [
            'label' => 'Blog Post',
            'plural_label' => 'Blog Posts',
            'supports' => [
                'categories',
                'tags',
                'featured_image',
                'excerpt',
                'seo',
                'author',
            ],
            'icon' => 'file-text',
            'description' => 'Blog posts with categories, tags, and featured images.',
        ],

        'page' => [
            'label' => 'Page',
            'plural_label' => 'Pages',
            'supports' => [
                'featured_image',
                'seo',
                'author',
            ],
            'icon' => 'file',
            'description' => 'Static pages without taxonomies.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Status
    |--------------------------------------------------------------------------
    |
    | The default status for newly created posts.
    |
    */

    'default_status' => 'draft',

    /*
    |--------------------------------------------------------------------------
    | Taxonomy Types
    |--------------------------------------------------------------------------
    |
    | Define the taxonomy type keys used for posts.
    |
    */

    'taxonomy_types' => [
        'categories' => 'post_categories',
        'tags' => 'post_tags',
    ],

    /*
    |--------------------------------------------------------------------------
    | Slug Settings
    |--------------------------------------------------------------------------
    |
    | Configure slug generation behavior.
    |
    */

    'slugs' => [
        'max_length' => 255,
        'separator' => '-',
    ],
];
