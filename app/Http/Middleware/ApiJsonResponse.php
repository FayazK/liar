<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiJsonResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force JSON response for API requests
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        // Add CORS headers
        $corsOrigins = config('api.cors.origins');
        $allowedOrigin = $corsOrigins === '*' ? '*' : $request->header('Origin', '*');

        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
        $response->headers->set('Access-Control-Allow-Methods', implode(', ', config('api.cors.methods')));
        $response->headers->set('Access-Control-Allow-Headers', implode(', ', config('api.cors.headers')));
        $response->headers->set('Access-Control-Expose-Headers', implode(', ', config('api.cors.exposed_headers')));
        $response->headers->set('Access-Control-Max-Age', (string) config('api.cors.max_age'));

        // Add API version header
        $response->headers->set('X-API-Version', config('api.version.current'));

        return $response;
    }
}
