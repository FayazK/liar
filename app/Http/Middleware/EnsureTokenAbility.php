<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenAbility
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ?string $permission = null): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated');
        }

        // If no specific permission is provided, infer from route action
        if (! $permission) {
            $permission = $this->inferPermissionFromRoute($request);
        }

        // Check if token has the required ability
        if ($permission && ! $user->tokenCan($permission)) {
            abort(403, 'Insufficient token permissions');
        }

        return $next($request);
    }

    /**
     * Infer permission from the route action.
     */
    protected function inferPermissionFromRoute(Request $request): ?string
    {
        $action = $request->route()?->getActionMethod();

        return match ($action) {
            'index', 'show' => 'read',
            'store', 'create' => 'create',
            'update', 'edit' => 'update',
            'destroy', 'delete' => 'delete',
            default => null,
        };
    }
}
