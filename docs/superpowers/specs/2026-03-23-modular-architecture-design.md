# Modular Architecture Design

**Date:** 2026-03-23
**Status:** Approved
**Package:** nwidart/laravel-modules v12

## Overview

Transform the monolithic Laravel 12 + Inertia/React 19 application into a modular architecture where features can be developed as self-contained modules, enabled/disabled via CLI, and eventually extracted to standalone Composer packages.

## Requirements

- Hybrid distribution: in-repo development → Composer package extraction when mature
- Three module states: enabled (full), disabled (soft, keeps data), uninstalled (removes data)
- Module dependency management with enforcement on enable/disable/uninstall
- Frontend assets co-located within modules, excluded from Vite build when disabled
- Artisan CLI for all module operations

## Package Choice: nwidart/laravel-modules

Selected over InterNACHI/modular (no enable/disable support) and custom build (low ROI). nwidart provides:
- Laravel 12 + PHP 8.3 compatibility (v12.0.5)
- Inertia + React support (newly added)
- 40+ generators matching service-repository architecture
- Module enable/disable via file or database activator
- Module dependency declaration in `module.json`
- 6K+ stars, 14.5M downloads, active maintenance

---

## Section 1: Module Directory Structure

Each module lives under `Modules/` at the project root:

```
Modules/
  Posts/
    app/
      Http/
        Controllers/
          Admin/
            PostController.php
          Api/
            V1/
              PostController.php
        Requests/
          Admin/
            PostStoreRequest.php
            PostUpdateRequest.php
            PostDataTableRequest.php
        Resources/
          Admin/
            PostResource.php
            PostCollection.php
      Models/
        Post.php
      Services/
        PostService.php
      Repositories/
        PostRepository.php
      Providers/
        PostsServiceProvider.php
        RouteServiceProvider.php
      Enums/
        PostStatus.php
        PostType.php
      Queries/
        PostDataTableQueryService.php
      Policies/
        PostPolicy.php
    config/
      post_types.php
    database/
      migrations/
      factories/
      seeders/
    resources/
      js/
        app.tsx            # Vite entry point for this module (imports module CSS/setup if needed)
        pages/
          admin/
            posts/
              index.tsx
              create.tsx
              edit.tsx
              post-form.tsx
        components/
          shared/          # Components exposed to other modules
    routes/
      web.php
      admin.php
      api.php
    tests/
      Feature/
      Unit/
    module.json
    composer.json
    package.json
    vite.config.js
```

Key points:
- Mirrors the existing service-repository architecture inside each module
- Frontend assets co-located under `resources/js/`
- Shared components in `resources/js/components/shared/` importable by other modules
- `module.json` declares metadata, dependencies, and activation status
- Each module is self-contained for future Composer package extraction

---

## Section 2: Module Registration & Discovery

### How modules get loaded

1. `ModuleServiceProvider` (from nwidart) is registered in `bootstrap/providers.php` — scans `Modules/` and loads each enabled module's service provider

2. Each module's `module.json` declares identity and dependencies:
```json
{
    "name": "Posts",
    "alias": "posts",
    "description": "CMS module for blog posts and pages",
    "priority": 0,
    "providers": [
        "Modules\\Posts\\App\\Providers\\PostsServiceProvider",
        "Modules\\Posts\\App\\Providers\\RouteServiceProvider"
    ],
    "dependencies": ["Library"],
    "files": []
}
```

3. Module service provider (`PostsServiceProvider`) registers:
   - Config files (`mergeConfigFrom`)
   - Migrations (`loadMigrationsFrom`)
   - Commands
   - Event listeners
   - Repository-to-interface bindings in the container

4. Route service provider loads `routes/web.php`, `routes/admin.php`, `routes/api.php` with appropriate middleware groups and prefixes

5. Autoloading: each module's `composer.json` defines PSR-4 namespaces (e.g., `Modules\\Posts\\` → `Modules/Posts/app/`), merged via `wikimedia/composer-merge-plugin`

### Composer merge plugin setup

The root `composer.json` must install and configure the merge plugin:

```bash
composer require wikimedia/composer-merge-plugin
```

Add to the root `composer.json` `extra` section:
```json
{
    "extra": {
        "merge-plugin": {
            "include": ["Modules/*/composer.json"],
            "recurse": false,
            "replace": false
        }
    },
    "config": {
        "allow-plugins": {
            "wikimedia/composer-merge-plugin": true
        }
    }
}
```

**Note:** After adding or removing a module, run `composer update` to refresh autoloading. In CI, ensure `composer install` runs after `modules_statuses.json` is in place.

### Enable/Disable flow

- `php artisan module:enable Posts` → adds to `modules_statuses.json`, provider loaded on next request
- `php artisan module:disable Posts` → removed from statuses, provider never loaded
- Dependency check: disabling `Library` when `Posts` depends on it warns/blocks

---

## Section 3: Frontend Integration (Vite + Inertia)

### Vite configuration

The root `vite.config.ts` is extended to discover enabled modules' assets while preserving all existing plugins (Tailwind, Wayfinder, SSR, etc.):

```ts
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { globSync } from 'glob';

// Read module statuses to only compile enabled modules' assets
function getEnabledModuleEntries(): string[] {
    const statusFile = './modules_statuses.json';
    if (!existsSync(statusFile)) return [];

    const statuses = JSON.parse(readFileSync(statusFile, 'utf-8'));
    return globSync('Modules/*/resources/js/app.tsx').filter((entry) => {
        const moduleName = entry.split('/')[1];
        return statuses[moduleName] === true;
    });
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
            '@': '/resources/js',
            '@modules': '/Modules',
        },
    },
});
```

**Key detail:** The `getEnabledModuleEntries()` function reads `modules_statuses.json` at build time to filter module assets. Disabled modules are excluded from the Vite build entirely.

### Inertia page resolution (client-side)

Update the `resolve` function in `resources/js/app.tsx`:

```ts
// Module pages are prefixed: "Posts::admin/posts/index"
// Core pages remain unchanged: "admin/dashboard"
resolve: (name) => {
    if (name.includes('::')) {
        const [module, ...rest] = name.split('::');
        const path = rest.join('::');
        const modulePages = import.meta.glob('../../Modules/*/resources/js/pages/**/*.tsx');
        const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
        if (modulePages[key]) return modulePages[key]();
        throw new Error(`Module page not found: ${name}`);
    }
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
},
```

### Inertia page resolution (SSR)

The same module-aware resolver must be applied in `resources/js/ssr.tsx`:

```ts
resolve: (name) => {
    if (name.includes('::')) {
        const [module, ...rest] = name.split('::');
        const path = rest.join('::');
        const modulePages = import.meta.glob('../../Modules/*/resources/js/pages/**/*.tsx');
        const key = `../../Modules/${module}/resources/js/pages/${path}.tsx`;
        if (modulePages[key]) return modulePages[key]();
        throw new Error(`Module page not found: ${name}`);
    }
    return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
},
```

**Important:** Both `app.tsx` and `ssr.tsx` must use identical resolve logic, otherwise SSR will fail for module pages.

### Backend rendering from module controller

```php
return Inertia::render('Posts::admin/posts/index', [
    'posts' => PostCollection::make($posts),
]);
```

### Disabled modules

- `getEnabledModuleEntries()` in `vite.config.ts` reads `modules_statuses.json` and filters out disabled modules' entry points
- Disabled module `app.tsx` entry points are excluded from the Vite build
- **Caveat:** The `import.meta.glob` in both `app.tsx` and `ssr.tsx` resolvers is a static pattern evaluated at build time — it will include page files from all modules on disk as lazy-loaded chunks, regardless of enabled status. However, these chunks are unreachable at runtime because disabled module routes are never registered server-side. The runtime impact is zero; the build artifact is slightly larger.
- To fully eliminate disabled module pages from the build, a custom Vite plugin could exclude disabled module paths — this is an optional optimization for later.
- After enabling/disabling a module, restart the Vite dev server (`npm run dev`) to pick up the change

### Cross-module shared components

```tsx
import { MediaPicker } from '@modules/Library/resources/js/components/shared/MediaPicker';
```

---

## Section 4: Enable/Disable & Uninstall System

### Three states

| State | Routes | Migrations | Assets | Data |
|-------|--------|-----------|--------|------|
| Enabled | Loaded | Run | Compiled | Exists |
| Disabled | Hidden | Skipped | Excluded from build | Preserved |
| Uninstalled | Removed | Rolled back | Excluded | Deleted |

### CLI commands

```bash
php artisan module:enable Posts        # Enable (registers providers, runs pending migrations)
php artisan module:disable Posts       # Disable (soft — keeps data, hides everything)
php artisan module:uninstall Posts     # Uninstall (rolls back migrations, removes tables)
php artisan module:make Comments       # Create new module scaffold
php artisan module:list                # List all modules with status
php artisan module:status Posts        # Check status and dependencies
```

### Dependency enforcement

- **On disable:** If `Posts` depends on `Library`, disabling `Library` prompts: "Posts depends on Library. Disable both? (y/n)" or aborts
- **On enable:** If `Posts` depends on disabled `Library`, auto-enables `Library` first (with confirmation)
- **On uninstall:** Same as disable check, requires `--force` or interactive confirmation for data loss

### Status tracking

`modules_statuses.json` at project root:
```json
{
    "Posts": true,
    "Library": true
}
```

Modules not listed default to disabled.

**Git strategy:** A default `modules_statuses.json` is committed with all shipped modules enabled. This ensures:
- New team members get a working app after cloning
- CI pipelines have a deterministic module state
- Individual developers can override locally (their changes won't be committed if the file is unchanged)

If per-environment overrides are needed, use a `.env` variable (e.g., `DISABLED_MODULES=Posts,Library`) that the module loader checks as an override layer on top of `modules_statuses.json`.

### Custom command

`module:enable`, `module:disable`, and `module:list` come from nwidart. The `module:uninstall` command (migration rollback + table drop) is a custom Artisan command built on top.

---

## Section 5: Core App vs Module Boundary

### Core app (never a module)

- Users & Authentication
- Roles & Permissions
- Base infrastructure: DataTable, AppServiceProvider, middleware, layouts, shared UI components
- Theme & appearance: ConfigProvider, Ant Design tokens, Tailwind config
- Wayfinder route generation
- API base classes: ApiController, ApiRequest, ApiResource, response traits

### What modules depend on from core

- User model and auth helpers
- Permission middleware and policies base
- DataTable base classes (`DataTableQueryService`, `DataTableRequest`)
- Shared UI components (`resources/js/components/ui/`)
- Base layouts (`resources/js/layouts/`)
- API base classes for modules exposing API endpoints

### Contracts layer

Core app provides interfaces that modules implement:

```php
// app/Contracts/HasAdminNavigation.php
interface HasAdminNavigation
{
    public static function adminNavItems(): array;
}

// app/Contracts/HasPermissions.php
interface HasPermissions
{
    public static function permissions(): array;
}

// app/Contracts/Searchable.php
interface Searchable
{
    public static function searchConfig(): array;
}
```

Modules implement these in their service providers. Core app discovers and aggregates from enabled modules — nav items appear in sidebar, permissions in roles editor, etc., without core knowing about specific modules.

---

## Section 6: Migration Strategy (Existing Code → Modules)

### Phase 1: Install infrastructure (now)

- Install `nwidart/laravel-modules`
- Configure for React, service-repository conventions
- Set up Vite integration and Inertia page resolver
- Build core contracts layer (`HasAdminNavigation`, `HasPermissions`, etc.)
- Build custom `module:uninstall` command
- Create a sample skeleton module to validate the full workflow

### Phase 2: Extract Posts module (future)

1. `php artisan module:make Posts` — scaffold directory
2. Move files from core to module:
   - `app/Models/Post.php` → `Modules/Posts/app/Models/Post.php`
   - `app/Services/PostService.php` → `Modules/Posts/app/Services/PostService.php`
   - Same for Repository, Controller, Requests, Resources, Queries, Enums, Policy
   - `config/post_types.php` → `Modules/Posts/config/post_types.php`
   - `resources/js/pages/admin/posts/` → `Modules/Posts/resources/js/pages/admin/posts/`
   - Related migrations → `Modules/Posts/database/migrations/`
3. Update namespaces from `App\` to `Modules\Posts\App\`
4. Update Inertia render calls to use `Posts::` prefix
5. Move routes from `routes/admin.php` to `Modules/Posts/routes/admin.php`
6. Implement core contracts in `PostsServiceProvider`
7. Remove old files from core, run tests

### Phase 3: Extract Library module (future)

- Same process as Posts
- Posts module declares `"dependencies": ["Library"]` in `module.json`

**Key rule:** Each extraction is atomic — one module at a time, fully tested before the next.

---

## Section 7: Testing Strategy

### Module-level tests

Each module has its own `tests/` directory:

```
Modules/Posts/tests/
  Feature/
    PostCrudTest.php
    PostApiTest.php
  Unit/
    PostServiceTest.php
```

### Running tests

```bash
php artisan test                           # All tests (core + enabled modules)
php artisan test --filter="Modules\\Posts" # Specific module
php artisan module:test Posts              # Module shorthand
```

### What to test per module

- Service layer business logic
- Controller HTTP responses (Inertia renders correct component with correct props)
- API endpoints if module exposes them
- Repository queries for non-trivial data access
- Dependency behavior — works when dependencies enabled, fails gracefully if not

### Core infrastructure tests

- Module discovery and registration
- Enable/disable/uninstall commands
- Dependency enforcement (blocking disable when dependents exist)
- Inertia page resolver finds module pages correctly
- Vite config discovers module assets
- Contracts aggregation (nav items, permissions collected from enabled modules)

### CI consideration

- Tests for disabled modules skipped automatically (providers not loaded)
- Each module's test suite runnable in isolation
