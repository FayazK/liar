# Modular Architecture — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install nwidart/laravel-modules infrastructure, configure it for the React/Inertia stack, set up Vite integration, build the core contracts layer, build a custom `module:uninstall` command, and validate everything with a skeleton module.

**Architecture:** Extend the existing Laravel 12 + Inertia/React 19 monolith with nwidart/laravel-modules v12. Modules live under `Modules/` at project root, each self-contained with backend (service-repository pattern) and frontend (React/Inertia pages) co-located. Core app provides contracts that modules implement for discovery (nav items, permissions, search).

**Tech Stack:** PHP 8.3, Laravel 12, nwidart/laravel-modules v12, wikimedia/composer-merge-plugin, Vite 7, React 19, Inertia v2, Pest 4

**Spec:** `docs/superpowers/specs/2026-03-23-modular-architecture-design.md`

---

## File Map

### Files to Create

| File | Responsibility |
|------|---------------|
| `app/Contracts/ModuleContracts/HasAdminNavigation.php` | Interface for modules providing admin sidebar nav items |
| `app/Contracts/ModuleContracts/HasPermissions.php` | Interface for modules registering permissions |
| `app/Contracts/ModuleContracts/Searchable.php` | Interface for modules providing search configuration |
| `app/Services/ModuleDiscoveryService.php` | Discovers and aggregates contract implementations from enabled modules |
| `app/Console/Commands/ModuleUninstallCommand.php` | Custom `module:uninstall` Artisan command (rollback migrations + drop tables) |
| `tests/Feature/Modules/ModuleInfrastructureTest.php` | Tests for module discovery, contracts aggregation, enable/disable |
| `tests/Feature/Modules/ModuleUninstallCommandTest.php` | Tests for the custom uninstall command |
| `modules_statuses.json` | Module activation status file (committed to git) |
| `Modules/Skeleton/app/Providers/SkeletonServiceProvider.php` | Skeleton module service provider implementing core contracts |
| `Modules/Skeleton/app/Providers/RouteServiceProvider.php` | Skeleton module route registration |
| `Modules/Skeleton/app/Http/Controllers/Admin/SkeletonController.php` | Skeleton module controller (single index action) |
| `Modules/Skeleton/config/config.php` | Skeleton module config |
| `Modules/Skeleton/database/migrations/2026_03_24_000001_create_skeleton_items_table.php` | Skeleton migration to test enable/disable/uninstall |
| `Modules/Skeleton/routes/admin.php` | Skeleton admin routes |
| `Modules/Skeleton/resources/js/app.tsx` | Skeleton Vite entry point |
| `Modules/Skeleton/resources/js/pages/admin/skeleton/index.tsx` | Skeleton index page component |
| `Modules/Skeleton/module.json` | Module metadata |
| `Modules/Skeleton/composer.json` | Module Composer config |
| `Modules/Skeleton/tests/Feature/SkeletonModuleTest.php` | Skeleton module feature tests |

### Files to Modify

| File | Change |
|------|--------|
| `composer.json` | Add `nwidart/laravel-modules`, `wikimedia/composer-merge-plugin`, configure `extra.merge-plugin` and `allow-plugins` |
| `bootstrap/providers.php` | No change needed — nwidart auto-registers via package discovery |
| `vite.config.ts` | Add `getEnabledModuleEntries()` function, add `@modules` alias, add module entries to input array |
| `resources/js/app.tsx:388-390` | Update `resolve` to handle module pages with `::` prefix |
| `resources/js/ssr.tsx:13` | Update `resolve` to handle module pages with `::` prefix |
| `tsconfig.json:111-113` | Add `@modules/*` path alias and include `Modules/` in `include` |
| `phpunit.xml:7-14` | Add `Modules` test suite |
| `tests/Pest.php:14-16` | Extend Pest config to include module Feature tests |

---

### Task 1: Install nwidart/laravel-modules and wikimedia/composer-merge-plugin

**Files:**
- Modify: `composer.json`

- [ ] **Step 1: Install nwidart/laravel-modules**

```bash
composer require nwidart/laravel-modules:^12.0
```

- [ ] **Step 2: Install wikimedia/composer-merge-plugin**

```bash
composer require wikimedia/composer-merge-plugin
```

- [ ] **Step 3: Configure composer-merge-plugin in composer.json**

In `composer.json`, update the `extra` section to include the merge-plugin config:

```json
"extra": {
    "laravel": {
        "dont-discover": []
    },
    "merge-plugin": {
        "include": ["Modules/*/composer.json"],
        "recurse": false,
        "replace": false
    }
}
```

And add to `config.allow-plugins`:

```json
"allow-plugins": {
    "pestphp/pest-plugin": true,
    "php-http/discovery": true,
    "wikimedia/composer-merge-plugin": true
}
```

- [ ] **Step 4: Publish the nwidart config**

```bash
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"
```

This creates `config/modules.php`.

- [ ] **Step 5: Verify installation**

```bash
php artisan module:list
```

Expected: empty table with no errors.

- [ ] **Step 6: Create the modules_statuses.json file**

Create `modules_statuses.json` at the project root with empty object (no modules yet):

```json
{}
```

- [ ] **Step 7: Commit**

```bash
git add composer.json composer.lock config/modules.php modules_statuses.json
git commit -m "feat: install nwidart/laravel-modules and wikimedia/composer-merge-plugin"
```

---

### Task 2: Configure nwidart/laravel-modules for the project stack

**Files:**
- Modify: `config/modules.php` (created in Task 1)

- [ ] **Step 1: Read the published config/modules.php**

Read the file to understand the default configuration options.

- [ ] **Step 2: Update config/modules.php settings**

Key settings to configure (update only what differs from defaults):

```php
// Namespace for modules
'namespace' => 'Modules',

// Path to modules directory
'paths' => [
    'modules' => base_path('Modules'),
    // Generator paths — ensure these match our service-repository architecture:
    'generator' => [
        // These configure where `php artisan module:make-*` commands put files
        'config'        => ['path' => 'config', 'generate' => true],
        'controller'    => ['path' => 'app/Http/Controllers', 'generate' => true],
        'model'         => ['path' => 'app/Models', 'generate' => true],
        'repository'    => ['path' => 'app/Repositories', 'generate' => true],
        'service'       => ['path' => 'app/Services', 'generate' => false],
        'provider'      => ['path' => 'app/Providers', 'generate' => true],
        'routes'        => ['path' => 'routes', 'generate' => true],
        'migration'     => ['path' => 'database/migrations', 'generate' => true],
        'factory'       => ['path' => 'database/factories', 'generate' => true],
        'seeder'        => ['path' => 'database/seeders', 'generate' => true],
        'request'       => ['path' => 'app/Http/Requests', 'generate' => true],
        'resource'      => ['path' => 'app/Http/Resources', 'generate' => true],
        'policy'        => ['path' => 'app/Policies', 'generate' => false],
        'test-feature'  => ['path' => 'tests/Feature', 'generate' => true],
        'test-unit'     => ['path' => 'tests/Unit', 'generate' => true],
    ],
],

// Activator — use file-based (default)
'activator' => 'file',

// Stubs — use the package defaults initially
'stubs' => [
    'enabled' => false,
],
```

Note: Read the actual published config first — the exact keys/structure may vary. Adjust the generator paths to match the project's service-repository directory structure. Only modify values that differ from defaults.

- [ ] **Step 3: Verify the configuration works**

```bash
php artisan module:list
```

Expected: empty table, no errors.

- [ ] **Step 4: Commit**

```bash
git add config/modules.php
git commit -m "feat: configure nwidart/laravel-modules for service-repository architecture"
```

---

### Task 3: Update Vite config for module asset discovery

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Write the failing test — verify current vite.config.ts builds without errors**

```bash
npm run build
```

Expected: builds successfully (baseline).

- [ ] **Step 2: Update vite.config.ts**

Replace the entire `vite.config.ts` with the module-aware version. The key changes are:
1. Add `fs` and `glob` imports
2. Add `getEnabledModuleEntries()` function that reads `modules_statuses.json`
3. Spread `moduleEntries` into the laravel plugin input array
4. Add `@modules` resolve alias

```ts
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, readdirSync } from 'fs';
import laravel from 'laravel-vite-plugin';
import { join } from 'path';
import { defineConfig } from 'vite';

function getEnabledModuleEntries(): string[] {
    const statusFile = './modules_statuses.json';
    if (!existsSync(statusFile)) return [];

    const statuses: Record<string, boolean> = JSON.parse(readFileSync(statusFile, 'utf-8'));
    const modulesDir = './Modules';
    if (!existsSync(modulesDir)) return [];

    return readdirSync(modulesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && statuses[dirent.name] === true)
        .map((dirent) => join('Modules', dirent.name, 'resources/js/app.tsx'))
        .filter((entry) => existsSync(entry));
}

const moduleEntries = getEnabledModuleEntries();

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
                'resources/css/front.css',
                'resources/js/front.js',
                ...moduleEntries,
            ],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@modules': '/Modules',
        },
    },
});
```

Note: The existing config does NOT have a `resolve.alias` block. The `@` alias is injected automatically by `laravel-vite-plugin` — do not redefine it here. The new `resolve.alias` block only adds `@modules`.

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: builds successfully with no module entries (modules_statuses.json is empty).

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts
git commit -m "feat: add module-aware asset discovery to Vite config"
```

---

### Task 4: Update Inertia page resolvers (app.tsx + ssr.tsx)

**Files:**
- Modify: `resources/js/app.tsx:388-390`
- Modify: `resources/js/ssr.tsx:13`

- [ ] **Step 1: Update the resolve function in app.tsx**

In `resources/js/app.tsx`, find line 390:

```ts
resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
```

Replace with:

```ts
resolve: (name) => {
    if (name.includes('::')) {
        const [module, ...rest] = name.split('::');
        const path = rest.join('::');
        const modulePages = import.meta.glob<ComponentType>('../../Modules/*/resources/js/pages/**/*.tsx');
        const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
        if (modulePages[key]) {
            return modulePages[key]();
        }
        throw new Error(`Module page not found: ${name}`);
    }
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
},
```

Note: The `import.meta.glob` for module pages uses a static string literal — this is a Vite requirement. The glob will pick up all module pages at build time as lazy chunks. This is acceptable per the spec (Section 3, "Disabled modules" caveat).

- [ ] **Step 2: Update the resolve function in ssr.tsx**

In `resources/js/ssr.tsx`, find line 13:

```ts
resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
```

Replace with the identical module-aware resolver. Note: add `import type { ComponentType } from 'react';` to the top of `ssr.tsx` since it's not currently imported:

```ts
resolve: (name) => {
    if (name.includes('::')) {
        const [module, ...rest] = name.split('::');
        const path = rest.join('::');
        const modulePages = import.meta.glob<ComponentType>('../../Modules/*/resources/js/pages/**/*.tsx');
        const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
        if (modulePages[key]) {
            return modulePages[key]();
        }
        throw new Error(`Module page not found: ${name}`);
    }
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
},
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: builds successfully. No module pages exist yet, so the glob returns empty.

- [ ] **Step 4: Commit**

```bash
git add resources/js/app.tsx resources/js/ssr.tsx
git commit -m "feat: add module-aware Inertia page resolvers for app.tsx and ssr.tsx"
```

---

### Task 5: Update TypeScript and PHPUnit config for modules

**Files:**
- Modify: `tsconfig.json:111-116`
- Modify: `phpunit.xml:7-14`
- Modify: `tests/Pest.php:14-16`

- [ ] **Step 1: Add @modules path alias to tsconfig.json**

In `tsconfig.json`, update the `paths` section (around line 111):

```json
"paths": {
    "@/*": ["./resources/js/*"],
    "@modules/*": ["./Modules/*"]
}
```

And update the `include` array (line 116) to also compile module TypeScript:

```json
"include": [
    "resources/js/**/*.ts",
    "resources/js/**/*.d.ts",
    "resources/js/**/*.tsx",
    "Modules/*/resources/js/**/*.ts",
    "Modules/*/resources/js/**/*.d.ts",
    "Modules/*/resources/js/**/*.tsx"
]
```

- [ ] **Step 2: Add Modules test suite to phpunit.xml**

PHPUnit's `<directory>` does not support glob patterns (`*`). Since Pest handles module test discovery via the `->in()` call in `tests/Pest.php` (next step), the `phpunit.xml` needs explicit module directories. For now with only the Skeleton module, add:

```xml
<testsuite name="Modules">
    <directory suffix="Test.php">Modules/Skeleton/tests/Feature</directory>
    <directory suffix="Test.php">Modules/Skeleton/tests/Unit</directory>
</testsuite>
```

Note: When adding new modules in the future, add their test directories here as well.

- [ ] **Step 3: Extend Pest config for module Feature tests**

In `tests/Pest.php`, update the `in()` call to include module Feature directories (line 14-16):

```php
pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature', '../Modules/*/tests/Feature');
```

- [ ] **Step 4: Verify TypeScript check passes**

```bash
npm run types
```

Expected: no new errors.

- [ ] **Step 5: Verify tests still pass**

```bash
php artisan test
```

Expected: all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json phpunit.xml tests/Pest.php
git commit -m "feat: configure TypeScript, PHPUnit, and Pest to support module directories"
```

---

### Task 6: Build core contracts layer

**Files:**
- Create: `app/Contracts/ModuleContracts/HasAdminNavigation.php`
- Create: `app/Contracts/ModuleContracts/HasPermissions.php`
- Create: `app/Contracts/ModuleContracts/Searchable.php`
- Create: `app/Services/ModuleDiscoveryService.php`
- Create: `tests/Feature/Modules/ModuleInfrastructureTest.php`

- [ ] **Step 1: Write the failing test for ModuleDiscoveryService**

Create `tests/Feature/Modules/ModuleInfrastructureTest.php`:

```php
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
php artisan test --filter=ModuleDiscoveryService
```

Expected: FAIL — class not found.

- [ ] **Step 3: Create the contract interfaces**

Create `app/Contracts/ModuleContracts/HasAdminNavigation.php`:

```php
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
```

Create `app/Contracts/ModuleContracts/HasPermissions.php`:

```php
<?php

declare(strict_types=1);

namespace App\Contracts\ModuleContracts;

interface HasPermissions
{
    /**
     * Return permissions registered by this module.
     *
     * @return array<string, array<int, string>>  Group name => list of permission slugs
     */
    public static function permissions(): array;
}
```

Create `app/Contracts/ModuleContracts/Searchable.php`:

```php
<?php

declare(strict_types=1);

namespace App\Contracts\ModuleContracts;

interface Searchable
{
    /**
     * Return search configuration for this module.
     *
     * @return array{model: class-string, fields: array<int, string>, label: string, route: string}
     */
    public static function searchConfig(): array;
}
```

- [ ] **Step 4: Create ModuleDiscoveryService**

Create `app/Services/ModuleDiscoveryService.php`:

```php
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
```

- [ ] **Step 5: Run test to verify it passes**

```bash
php artisan test --filter=ModuleDiscoveryService
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/Contracts/ModuleContracts/ app/Services/ModuleDiscoveryService.php tests/Feature/Modules/ModuleInfrastructureTest.php
git commit -m "feat: add core module contracts and ModuleDiscoveryService"
```

---

### Task 7: Build custom module:uninstall command

**Files:**
- Create: `app/Console/Commands/ModuleUninstallCommand.php`
- Create: `tests/Feature/Modules/ModuleUninstallCommandTest.php`

- [ ] **Step 1: Write the failing test**

Create `tests/Feature/Modules/ModuleUninstallCommandTest.php`:

```php
<?php

declare(strict_types=1);

use Nwidart\Modules\Facades\Module;

describe('module:uninstall command', function () {
    it('requires a module name argument', function () {
        $this->artisan('module:uninstall')
            ->assertExitCode(1);
    });

    it('fails when module does not exist', function () {
        $this->artisan('module:uninstall NonExistent')
            ->expectsOutput('Module "NonExistent" does not exist.')
            ->assertExitCode(1);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
php artisan test --filter=ModuleUninstallCommandTest
```

Expected: FAIL — command not found.

- [ ] **Step 3: Create the ModuleUninstallCommand**

Create `app/Console/Commands/ModuleUninstallCommand.php`:

```php
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
        // Note: Verify the exact command signature after installing nwidart with:
        // php artisan module:migrate-rollback --help
        $this->info("Rolling back migrations for \"{$name}\"...");
        $this->call('module:migrate-rollback', [
            'module' => $name,
        ]);

        // Disable the module
        $this->info("Disabling module \"{$name}\"...");
        $this->call('module:disable', ['module' => $name]);

        $this->info("Module \"{$name}\" has been uninstalled successfully.");
        $this->warn('Note: Module files remain on disk. Remove the Modules/' . $name . ' directory to fully delete.');

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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
php artisan test --filter=ModuleUninstallCommandTest
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/Console/Commands/ModuleUninstallCommand.php tests/Feature/Modules/ModuleUninstallCommandTest.php
git commit -m "feat: add module:uninstall Artisan command with dependency checking"
```

---

### Task 8: Create skeleton module to validate the workflow

**Files:**
- Create: all files under `Modules/Skeleton/`

This task validates that the entire infrastructure works end-to-end: module creation, registration, routes, migrations, Inertia page rendering, enable/disable, and uninstall.

- [ ] **Step 1: Generate the skeleton module using nwidart**

```bash
php artisan module:make Skeleton
```

This scaffolds the base directory structure. Inspect the output to understand what was generated.

- [ ] **Step 2: Create a simple migration**

Create `Modules/Skeleton/database/migrations/2026_03_24_000001_create_skeleton_items_table.php`:

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skeleton_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skeleton_items');
    }
};
```

- [ ] **Step 3: Create the admin controller**

Create `Modules/Skeleton/app/Http/Controllers/Admin/SkeletonController.php`:

```php
<?php

declare(strict_types=1);

namespace Modules\Skeleton\App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SkeletonController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Skeleton::admin/skeleton/index', [
            'message' => 'Skeleton module is working!',
        ]);
    }
}
```

- [ ] **Step 4: Create admin routes**

Create (or update) `Modules/Skeleton/routes/admin.php`:

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\Skeleton\App\Http\Controllers\Admin\SkeletonController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/skeleton')
    ->name('admin.skeleton.')
    ->group(function () {
        Route::get('/', [SkeletonController::class, 'index'])->name('index');
    });
```

- [ ] **Step 5: Update the module's service provider to implement contracts**

Update `Modules/Skeleton/app/Providers/SkeletonServiceProvider.php` to implement core contracts:

```php
<?php

declare(strict_types=1);

namespace Modules\Skeleton\App\Providers;

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
```

- [ ] **Step 6: Create the module's RouteServiceProvider**

Create (or update) `Modules/Skeleton/app/Providers/RouteServiceProvider.php`:

```php
<?php

declare(strict_types=1);

namespace Modules\Skeleton\App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(module_path('Skeleton', 'routes/admin.php'));
    }
}
```

- [ ] **Step 7: Create the module config**

Create `Modules/Skeleton/config/config.php`:

```php
<?php

declare(strict_types=1);

return [
    'name' => 'Skeleton',
];
```

- [ ] **Step 8: Update module.json to declare no dependencies**

Ensure `Modules/Skeleton/module.json` contains:

```json
{
    "name": "Skeleton",
    "alias": "skeleton",
    "description": "Skeleton module for validating the modular architecture infrastructure",
    "priority": 0,
    "providers": [
        "Modules\\Skeleton\\App\\Providers\\SkeletonServiceProvider",
        "Modules\\Skeleton\\App\\Providers\\RouteServiceProvider"
    ],
    "dependencies": [],
    "files": []
}
```

- [ ] **Step 9: Create the React index page**

Create `Modules/Skeleton/resources/js/app.tsx`:

```tsx
// Skeleton module Vite entry point
// This file is required for Vite to discover this module's assets
```

Create `Modules/Skeleton/resources/js/pages/admin/skeleton/index.tsx`:

```tsx
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

interface SkeletonIndexProps {
    message: string;
}

export default function SkeletonIndex({ message }: SkeletonIndexProps) {
    return (
        <AdminLayout>
            <Head title="Skeleton Module" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Skeleton Module</h1>
                <p className="mt-2 text-gray-600">{message}</p>
            </div>
        </AdminLayout>
    );
}
```

Note: The layout import (`AdminLayout`) should match the existing layout component name in the project. Check `resources/js/layouts/` for the correct import path and component name before writing. If the layout is named differently (e.g., `AppLayout`, `AuthenticatedLayout`), use that instead.

- [ ] **Step 10: Enable the Skeleton module and run migrations**

```bash
php artisan module:enable Skeleton
php artisan module:migrate Skeleton
```

- [ ] **Step 11: Update modules_statuses.json**

After enabling, verify `modules_statuses.json` now contains:

```json
{
    "Skeleton": true
}
```

Commit this file so the module is enabled by default for the team.

- [ ] **Step 12: Verify the frontend build includes the module**

```bash
npm run build
```

Expected: builds successfully. The Skeleton module's `app.tsx` should be included as an entry.

- [ ] **Step 13: Commit**

```bash
git add Modules/Skeleton/ modules_statuses.json
git commit -m "feat: add Skeleton module to validate modular architecture infrastructure"
```

---

### Task 9: Write integration tests for the full module lifecycle

**Files:**
- Create: `Modules/Skeleton/tests/Feature/SkeletonModuleTest.php`
- Modify: `tests/Feature/Modules/ModuleInfrastructureTest.php`

- [ ] **Step 1: Write Skeleton module feature test**

Create `Modules/Skeleton/tests/Feature/SkeletonModuleTest.php`:

```php
<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;

describe('Skeleton module', function () {
    it('renders the skeleton index page for admin users', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $response = $this->actingAs($user)
            ->get('/admin/skeleton');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Skeleton::admin/skeleton/index')
            ->has('message')
        );
    });

    it('denies access to non-admin users', function () {
        $role = Role::factory()->create(['name' => 'User']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin/skeleton')
            ->assertForbidden();
    });
});
```

- [ ] **Step 2: Add contract integration tests**

Update `tests/Feature/Modules/ModuleInfrastructureTest.php` to add tests with the Skeleton module:

```php
describe('ModuleDiscoveryService with Skeleton module', function () {
    it('discovers admin nav items from the Skeleton module', function () {
        $service = app(ModuleDiscoveryService::class);
        $navItems = $service->getAdminNavItems();

        expect($navItems)->not->toBeEmpty();
        expect($navItems[0]['label'])->toBe('Skeleton');
    });

    it('discovers permissions from the Skeleton module', function () {
        $service = app(ModuleDiscoveryService::class);
        $permissions = $service->getPermissions();

        expect($permissions)->toHaveKey('skeleton');
        expect($permissions['skeleton'])->toContain('skeleton.view');
    });
});
```

- [ ] **Step 3: Run all module tests**

```bash
php artisan test --filter=Modules
```

Expected: all tests pass.

- [ ] **Step 4: Run the full test suite**

```bash
php artisan test
```

Expected: all existing tests still pass alongside new module tests.

- [ ] **Step 5: Commit**

```bash
git add Modules/Skeleton/tests/ tests/Feature/Modules/
git commit -m "test: add integration tests for Skeleton module and module infrastructure"
```

---

### Task 10: Validate enable/disable/uninstall lifecycle

**Files:**
- No new files — this is a validation task using CLI commands.

- [ ] **Step 1: Verify module is currently enabled**

```bash
php artisan module:list
```

Expected: Skeleton module shown as enabled.

- [ ] **Step 2: Test disable**

```bash
php artisan module:disable Skeleton
```

Verify: `modules_statuses.json` now shows `"Skeleton": false` or the key is removed.

- [ ] **Step 3: Verify disabled module's routes are not accessible**

```bash
php artisan route:list --path=admin/skeleton
```

Expected: no routes for skeleton.

- [ ] **Step 4: Re-enable the module**

```bash
php artisan module:enable Skeleton
```

Verify routes are back:

```bash
php artisan route:list --path=admin/skeleton
```

Expected: skeleton routes visible.

- [ ] **Step 5: Test uninstall**

```bash
php artisan module:uninstall Skeleton --force
```

Expected: migrations rolled back, module disabled.

- [ ] **Step 6: Re-enable and re-migrate for final state**

```bash
php artisan module:enable Skeleton
php artisan module:migrate Skeleton
```

- [ ] **Step 7: Run lint and format checks**

```bash
vendor/bin/pint --dirty
npm run lint
npm run types
```

Fix any issues.

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "chore: validate module lifecycle and fix any lint issues"
```

---

### Task 11: Final verification — full build and test

- [ ] **Step 1: Run the full backend test suite**

```bash
php artisan test
```

Expected: all tests pass.

- [ ] **Step 2: Run the full frontend build**

```bash
npm run build
```

Expected: builds successfully.

- [ ] **Step 3: Run TypeScript check**

```bash
npm run types
```

Expected: no errors.

- [ ] **Step 4: Run lint and format**

```bash
vendor/bin/pint --dirty
npm run lint
```

Expected: clean.

- [ ] **Step 5: Review modules_statuses.json is committed with Skeleton enabled**

```bash
cat modules_statuses.json
```

Expected: `{"Skeleton": true}`

- [ ] **Step 6: Final commit if any remaining changes**

```bash
git status
# If changes exist:
git add -A
git commit -m "chore: final cleanup for modular architecture Phase 1"
```
