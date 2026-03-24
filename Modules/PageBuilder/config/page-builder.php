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
];
