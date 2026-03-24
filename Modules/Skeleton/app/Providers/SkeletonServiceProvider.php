<?php

declare(strict_types=1);

namespace Modules\Skeleton\Providers;

use App\Contracts\ModuleContracts\HasAdminNavigation;
use App\Contracts\ModuleContracts\HasPermissions;
use Illuminate\Support\ServiceProvider;

class SkeletonServiceProvider extends ServiceProvider implements HasAdminNavigation, HasPermissions
{
    protected string $moduleName = 'Skeleton';

    protected string $moduleNameLower = 'skeleton';

    public function boot(): void
    {
        $this->registerConfig();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'database/migrations'));
    }

    public function register(): void
    {
        //
    }

    protected function registerConfig(): void
    {
        $configPath = module_path($this->moduleName, 'config/config.php');

        if (file_exists($configPath)) {
            $this->mergeConfigFrom($configPath, $this->moduleNameLower);
        }
    }

    public static function adminNavItems(): array
    {
        return [
            [
                'label' => 'Skeleton',
                'icon' => 'box',
                'route' => '/admin/skeleton',
                'permission' => 'skeleton.view',
            ],
        ];
    }

    public static function permissions(): array
    {
        return [
            'skeleton' => [
                'skeleton.view',
                'skeleton.create',
                'skeleton.update',
                'skeleton.delete',
            ],
        ];
    }
}
