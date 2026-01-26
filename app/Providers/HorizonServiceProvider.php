<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\Horizon;
use Laravel\Horizon\HorizonApplicationServiceProvider;

class HorizonServiceProvider extends HorizonApplicationServiceProvider
{
    public function boot(): void
    {
        parent::boot();

        // Single-line auth using existing helper
        Horizon::auth(fn () => is_root_user());
    }

    #[\Override]
    protected function gate(): void
    {
        Gate::define('viewHorizon', fn ($user) => is_root_user($user));
    }
}
