<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Nwidart\Modules\Facades\Module;

class ModuleUninstallCommand extends Command
{
    protected $signature = 'module:uninstall
        {name : The name of the module to uninstall}
        {--force : Skip confirmation prompts}';

    protected $description = 'Uninstall a module by rolling back its migrations and disabling it';

    public function handle(): int
    {
        /** @var string $name */
        $name = $this->argument('name');

        $module = Module::find($name);

        if (! $module) {
            $this->error("Module \"{$name}\" does not exist.");

            return self::FAILURE;
        }

        // Check for dependent modules
        $dependents = $this->findDependents($name);
        if (! empty($dependents)) {
            $dependentNames = implode(', ', $dependents);
            $this->error("Cannot uninstall \"{$name}\": the following modules depend on it: {$dependentNames}");
            $this->info('Uninstall or disable the dependent modules first, or use --force.');

            if (! $this->option('force')) {
                return self::FAILURE;
            }

            $this->warn('--force flag used. Proceeding despite dependencies.');
        }

        if (! $this->option('force')) {
            if (! $this->confirm("This will roll back all migrations for \"{$name}\" and remove its data. Continue?")) {
                $this->info('Uninstall cancelled.');

                return self::SUCCESS;
            }
        }

        // Roll back the module's migrations
        $this->info("Rolling back migrations for \"{$name}\"...");
        $this->call('module:migrate-rollback', [
            'module' => [$name],
        ]);

        // Disable the module
        $this->info("Disabling module \"{$name}\"...");
        $this->call('module:disable', [
            'module' => [$name],
        ]);

        $this->info("Module \"{$name}\" has been uninstalled successfully.");
        $this->warn('Note: Module files remain on disk. Remove the Modules/'.$name.' directory to fully delete.');

        return self::SUCCESS;
    }

    /**
     * Find modules that depend on the given module.
     *
     * @return array<int, string>
     */
    private function findDependents(string $moduleName): array
    {
        $dependents = [];

        foreach (Module::allEnabled() as $module) {
            $json = $module->json();
            $dependencies = $json->get('dependencies', []);

            if (in_array($moduleName, $dependencies, true)) {
                $dependents[] = $module->getName();
            }
        }

        return $dependents;
    }
}
