<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | API Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Define the rate limiting settings for API requests.
    |
    */

    'rate_limit' => env('API_RATE_LIMIT', 60),

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Define the allowed origins for cross-origin requests.
    |
    */

    'cors' => [
        'origins' => env('API_CORS_ORIGINS', '*'),
        'methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        'exposed_headers' => ['X-API-Version', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
        'credentials' => false,
        'max_age' => 86400,
    ],

    /*
    |--------------------------------------------------------------------------
    | Token Configuration
    |--------------------------------------------------------------------------
    |
    | Define token expiration and naming conventions.
    |
    */

    'token' => [
        'expiration' => null, // null = never expires
        'name_prefix' => 'api_token',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination Defaults
    |--------------------------------------------------------------------------
    |
    | Define default pagination settings for API responses.
    |
    */

    'pagination' => [
        'default_per_page' => 15,
        'max_per_page' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | API Versioning
    |--------------------------------------------------------------------------
    |
    | Define the current API version and supported versions.
    |
    */

    'version' => [
        'current' => 'v1',
        'supported' => ['v1'],
    ],

];
