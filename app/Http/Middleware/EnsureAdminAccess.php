<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    /**
     * Ensure user has admin access.
     *
     * Root users and users with 'Admin' role bypass via Gate::before.
     * Other users need 'admin.access' permission.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Gate::allows('admin.access')) {
            abort(403, 'You do not have permission to access the admin area.');
        }

        return $next($request);
    }
}
