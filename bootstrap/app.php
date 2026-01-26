<?php

use App\Exceptions\ApiException;
use App\Http\Middleware\ApiJsonResponse;
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\EnsureAdminAccess;
use App\Http\Middleware\EnsureTokenAbility;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
        then: function () {
            // Configure API rate limiting
            RateLimiter::for('api', function (Request $request) {
                return Limit::perMinute(config('api.rate_limit'))
                    ->by($request->user()?->id ?: $request->ip())
                    ->response(function (Request $request, array $headers) {
                        return response()->json([
                            'errors' => [
                                [
                                    'status' => '429',
                                    'title' => 'Too Many Requests',
                                    'detail' => 'You have exceeded the rate limit. Please try again later.',
                                ],
                            ],
                        ], 429, $headers);
                    });
            });
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->api(append: [
            ApiJsonResponse::class,
        ]);

        $middleware->alias([
            'permission' => CheckPermission::class,
            'admin' => EnsureAdminAccess::class,
            'token.ability' => EnsureTokenAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle API exceptions in JSON:API format
        $exceptions->render(function (ApiException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['errors' => [$e->toArray()]], $e->getStatusCode());
            }
        });
    })->create();
