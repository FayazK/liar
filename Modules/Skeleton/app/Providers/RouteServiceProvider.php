<?php

declare(strict_types=1);

namespace Modules\Skeleton\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(module_path('Skeleton', 'routes/admin.php'));
    }
}
