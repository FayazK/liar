<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Models\SectionTemplate;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::model('template', SectionTemplate::class);

        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/admin.php'));
        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/web.php'));
    }
}
