<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Providers;

use App\Contracts\ModuleContracts\HasAdminNavigation;
use App\Contracts\ModuleContracts\HasPermissions;
use Illuminate\Support\ServiceProvider;
use Modules\PageBuilder\Repositories\BuilderPageRepository;
use Modules\PageBuilder\Repositories\BuilderPageRepositoryInterface;

class PageBuilderServiceProvider extends ServiceProvider implements HasAdminNavigation, HasPermissions
{
    protected string $moduleName = 'PageBuilder';

    protected string $moduleNameLower = 'page-builder';

    public function boot(): void
    {
        $this->registerConfig();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'database/migrations'));
    }

    public function register(): void
    {
        $this->app->bind(BuilderPageRepositoryInterface::class, BuilderPageRepository::class);
    }

    protected function registerConfig(): void
    {
        $configPath = module_path($this->moduleName, 'config/page-builder.php');

        if (file_exists($configPath)) {
            $this->mergeConfigFrom($configPath, $this->moduleNameLower);
        }
    }

    public static function adminNavItems(): array
    {
        return [
            [
                'label' => 'Page Builder',
                'icon' => 'layout',
                'route' => '/admin/page-builder',
                'permission' => 'page-builder.view',
            ],
        ];
    }

    public static function permissions(): array
    {
        return [
            'page-builder' => [
                'page-builder.view',
                'page-builder.create',
                'page-builder.update',
                'page-builder.delete',
                'page-builder.publish',
            ],
        ];
    }
}
