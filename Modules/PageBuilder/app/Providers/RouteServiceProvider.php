<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/admin.php'));
        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/web.php'));
    }
}
