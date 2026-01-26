<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Super admin bypass - Admin role has all permissions
        Gate::before(function (User $user, string $ability): ?bool {
            if ($user->role?->name === 'Admin') {
                return true;
            }

            // Check if user has the permission
            if ($user->getPermissions()->contains('key', $ability)) {
                return true;
            }

            return null;
        });
    }
}
