<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\ModuleContracts\HasAdminNavigation;
use App\Contracts\ModuleContracts\HasPermissions;
use App\Contracts\ModuleContracts\Searchable;
use Nwidart\Modules\Facades\Module;

class ModuleDiscoveryService
{
    /**
     * Get admin nav items from all enabled modules that implement HasAdminNavigation.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getAdminNavItems(): array
    {
        return $this->collectFromContract(HasAdminNavigation::class, 'adminNavItems');
    }

    /**
     * Get permissions from all enabled modules that implement HasPermissions.
     *
     * @return array<string, array<int, string>>
     */
    public function getPermissions(): array
    {
        $all = [];
        foreach ($this->getEnabledModuleProviders() as $provider) {
            if ($provider instanceof HasPermissions) {
                $all = array_merge($all, $provider::permissions());
            }
        }

        return $all;
    }

    /**
     * Get search configs from all enabled modules that implement Searchable.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSearchableConfigs(): array
    {
        return $this->collectFromContract(Searchable::class, 'searchConfig');
    }

    /**
     * Collect static method results from providers implementing a given contract.
     *
     * @param  class-string  $contract
     * @return array<int, mixed>
     */
    private function collectFromContract(string $contract, string $method): array
    {
        $results = [];
        foreach ($this->getEnabledModuleProviders() as $provider) {
            if ($provider instanceof $contract) {
                $results[] = $provider::$method();
            }
        }

        return $results;
    }

    /**
     * Get all registered service provider instances from enabled modules.
     * Reads the providers list from each module's module.json for robustness.
     *
     * @return array<int, object>
     */
    private function getEnabledModuleProviders(): array
    {
        $providers = [];
        foreach (Module::allEnabled() as $module) {
            foreach ($module->json()->get('providers', []) as $providerClass) {
                if (class_exists($providerClass)) {
                    $provider = app()->getProvider($providerClass);
                    if ($provider) {
                        $providers[] = $provider;
                    }
                }
            }
        }

        return $providers;
    }
}
