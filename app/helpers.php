<?php

declare(strict_types=1);

use App\Models\User;

if (! function_exists('is_root_user')) {
    /**
     * Check if the given user is a root user (super admin by email).
     * Root users have complete access to all features, bypassing both roles and permissions.
     */
    function is_root_user(?User $user = null): bool
    {
        $user = $user ?? auth()->user();

        if (! $user) {
            return false;
        }

        $rootUsers = config('auth.root_users', []);

        return in_array($user->email, $rootUsers, strict: true);
    }
}
