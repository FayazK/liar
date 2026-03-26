<?php

declare(strict_types=1);

namespace App\Contracts\ModuleContracts;

interface HasAdminNavigation
{
    /**
     * Return admin sidebar navigation items for this module.
     *
     * @return array<int, array{label: string, icon: string, route: string, permission?: string, children?: array<int, array{label: string, route: string, permission?: string}>}>
     */
    public static function adminNavItems(): array;
}
