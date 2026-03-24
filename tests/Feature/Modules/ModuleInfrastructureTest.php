<?php

declare(strict_types=1);

use App\Services\ModuleDiscoveryService;

describe('ModuleDiscoveryService', function () {
    it('returns arrays from module discovery methods', function () {
        $service = app(ModuleDiscoveryService::class);

        expect($service->getAdminNavItems())->toBeArray();
        expect($service->getPermissions())->toBeArray();
        expect($service->getSearchableConfigs())->toBeArray();
    });
});

describe('ModuleDiscoveryService with Skeleton module', function () {
    it('discovers admin nav items from the Skeleton module', function () {
        $service = app(ModuleDiscoveryService::class);
        $navItems = $service->getAdminNavItems();

        expect($navItems)->not->toBeEmpty();

        // collectFromContract wraps each module's result, so flatten to check
        $flatItems = array_merge(...$navItems);
        $labels = array_column($flatItems, 'label');
        expect($labels)->toContain('Skeleton');
    });

    it('discovers permissions from the Skeleton module', function () {
        $service = app(ModuleDiscoveryService::class);
        $permissions = $service->getPermissions();

        expect($permissions)->toHaveKey('skeleton');
        expect($permissions['skeleton'])->toContain('skeleton.view');
    });
});
