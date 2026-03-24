<?php

declare(strict_types=1);

use App\Services\ModuleDiscoveryService;

describe('ModuleDiscoveryService', function () {
    it('returns empty arrays when no modules implement contracts', function () {
        $service = app(ModuleDiscoveryService::class);

        expect($service->getAdminNavItems())->toBeArray()->toBeEmpty();
        expect($service->getPermissions())->toBeArray()->toBeEmpty();
        expect($service->getSearchableConfigs())->toBeArray()->toBeEmpty();
    });
});
