<?php

declare(strict_types=1);

return [
    'auto_save_interval' => env('PAGE_BUILDER_AUTO_SAVE_INTERVAL', 30),
    'compilation' => [
        'minify_html' => true,
        'minify_css' => true,
        'purge_css' => true,
    ],
    'public_route_prefix' => 'p',
    'ai' => [
        'timeout' => env('PAGE_BUILDER_AI_TIMEOUT', 90),
        'provider' => env('PAGE_BUILDER_AI_PROVIDER', null),
        'image_provider' => env('PAGE_BUILDER_AI_IMAGE_PROVIDER', null),
        'max_sections_per_page' => 8,
    ],
];
