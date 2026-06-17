# Page Builder SP1: Core Builder Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the GrapesJS-powered page builder module with drag-and-drop editor, section templates, page compilation, and public rendering.

**Architecture:** A `nwidart/laravel-modules` module (`PageBuilder`) that extends the existing Post model with a builder editor option. Admin-side uses GrapesJS wrapped in React. Public-side renders compiled static HTML via Blade. Follows the project's Service-Repository pattern.

**Tech Stack:** Laravel 12, GrapesJS, React 19, Inertia v2, Ant Design v6, Tailwind v4, Spatie MediaLibrary, Pest v4

**Spec:** `docs/superpowers/specs/2026-03-24-page-builder-design.md`

---

## File Map

### Module Scaffold (PHP)
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/module.json` | Create | Module metadata, providers, dependencies |
| `Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php` | Create | Boot module, register bindings, implement contracts |
| `Modules/PageBuilder/app/Providers/RouteServiceProvider.php` | Create | Load admin + web routes |
| `Modules/PageBuilder/config/page-builder.php` | Create | Module config (auto-save interval, compilation options) |

### Database
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/database/migrations/0001_add_editor_mode_to_posts_table.php` | Create | Add `editor_mode` enum column to `posts` |
| `Modules/PageBuilder/database/migrations/0002_create_builder_pages_table.php` | Create | `builder_pages` table |
| `Modules/PageBuilder/database/migrations/0003_create_section_templates_table.php` | Create | `section_templates` table |
| `Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php` | Create | Seed initial section templates (hero category only for SP1) |

### Models & Repository
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/app/Models/BuilderPage.php` | Create | Eloquent model, belongsTo Post |
| `Modules/PageBuilder/app/Models/SectionTemplate.php` | Create | Eloquent model for templates |
| `Modules/PageBuilder/app/Repositories/BuilderPageRepositoryInterface.php` | Create | Repository contract |
| `Modules/PageBuilder/app/Repositories/BuilderPageRepository.php` | Create | Repository implementation |

### Services
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/app/Services/PageBuilderService.php` | Create | Business logic: create/update/delete builder pages |
| `Modules/PageBuilder/app/Services/PageCompilerService.php` | Create | Compile GrapesJS JSON → static HTML+CSS |
| `Modules/PageBuilder/app/Services/SectionTemplateService.php` | Create | Fetch/manage section templates |

### Controllers & Routes
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php` | Create | Admin CRUD + editor endpoint |
| `Modules/PageBuilder/app/Http/Controllers/PublicPageController.php` | Create | Render compiled pages at `/p/{slug}` |
| `Modules/PageBuilder/app/Http/Requests/StorePageRequest.php` | Create | Validation for creating pages |
| `Modules/PageBuilder/app/Http/Requests/UpdatePageRequest.php` | Create | Validation for updating/auto-saving |
| `Modules/PageBuilder/routes/admin.php` | Create | Admin routes |
| `Modules/PageBuilder/routes/web.php` | Create | Public `/p/{slug}` route |

### Frontend
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/resources/js/app.tsx` | Create | Module Vite entry point |
| `Modules/PageBuilder/resources/js/pages/admin/page-builder/index.tsx` | Create | List builder pages (DataTable) |
| `Modules/PageBuilder/resources/js/pages/admin/page-builder/create.tsx` | Create | Choose editor mode + basic page info |
| `Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx` | Create | GrapesJS editor page |
| `Modules/PageBuilder/resources/js/components/GrapesEditor.tsx` | Create | React wrapper for GrapesJS |
| `Modules/PageBuilder/resources/js/components/SectionPanel.tsx` | Create | Section template browser panel |
| `Modules/PageBuilder/resources/js/components/StylePresets.tsx` | Create | Constrained style options panel |
| `Modules/PageBuilder/resources/js/lib/grapes-config.ts` | Create | GrapesJS init configuration |
| `Modules/PageBuilder/resources/js/lib/grapes-blocks.ts` | Create | Register section templates as blocks |
| `Modules/PageBuilder/resources/js/lib/grapes-plugins.ts` | Create | Custom GrapesJS plugins |

### Blade & Public
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/resources/views/page.blade.php` | Create | Blade layout for compiled pages |

### Core App Changes
| File | Action | Responsibility |
|------|--------|----------------|
| `app/Models/Post.php` | Modify | Add `hasOne BuilderPage` relationship, add `editor_mode` to fillable/casts |
| `modules_statuses.json` | Modify | Enable PageBuilder module |

### Tests
| File | Action | Responsibility |
|------|--------|----------------|
| `Modules/PageBuilder/tests/Feature/PageBuilderModuleTest.php` | Create | Module registration, nav, permissions |
| `Modules/PageBuilder/tests/Feature/PageBuilderCrudTest.php` | Create | Create/update/delete builder pages |
| `Modules/PageBuilder/tests/Feature/PageCompilerTest.php` | Create | Compilation pipeline |
| `Modules/PageBuilder/tests/Feature/PublicPageTest.php` | Create | Public page rendering |
| `Modules/PageBuilder/tests/Feature/SectionTemplateTest.php` | Create | Section template seeding and retrieval |

---

## Task 1: Module Scaffold

**Files:**
- Create: `Modules/PageBuilder/module.json`
- Create: `Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php`
- Create: `Modules/PageBuilder/app/Providers/RouteServiceProvider.php`
- Create: `Modules/PageBuilder/config/page-builder.php`
- Create: `Modules/PageBuilder/routes/admin.php`
- Create: `Modules/PageBuilder/routes/web.php`
- Create: `Modules/PageBuilder/resources/js/app.tsx`
- Modify: `modules_statuses.json`
- Test: `Modules/PageBuilder/tests/Feature/PageBuilderModuleTest.php`

- [ ] **Step 1: Write module test**

```php
<?php
// Modules/PageBuilder/tests/Feature/PageBuilderModuleTest.php
declare(strict_types=1);

use App\Models\Role;
use App\Models\User;

describe('PageBuilder module', function () {
    it('is registered and enabled', function () {
        $statuses = json_decode(file_get_contents(base_path('modules_statuses.json')), true);
        expect($statuses['PageBuilder'])->toBeTrue();
    });

    it('provides admin navigation items', function () {
        $provider = app()->getProvider(\Modules\PageBuilder\Providers\PageBuilderServiceProvider::class);
        expect($provider)->not->toBeNull();

        $navItems = \Modules\PageBuilder\Providers\PageBuilderServiceProvider::adminNavItems();
        expect($navItems)->toBeArray()->not->toBeEmpty();
        expect($navItems[0]['label'])->toBe('Page Builder');
        expect($navItems[0]['route'])->toBe('/admin/page-builder');
    });

    it('provides permissions', function () {
        $permissions = \Modules\PageBuilder\Providers\PageBuilderServiceProvider::permissions();
        expect($permissions)->toHaveKey('page-builder');
        expect($permissions['page-builder'])->toContain('page-builder.view');
        expect($permissions['page-builder'])->toContain('page-builder.create');
        expect($permissions['page-builder'])->toContain('page-builder.update');
        expect($permissions['page-builder'])->toContain('page-builder.delete');
    });

    it('renders the index page for admin users', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $response = $this->actingAs($user)->get('/admin/page-builder');
        $response->assertOk();
    });

    it('denies access to non-admin users', function () {
        $role = Role::factory()->create(['name' => 'User']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)->get('/admin/page-builder')->assertForbidden();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
php artisan test --filter=PageBuilderModuleTest
```
Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Create module.json**

```json
// Modules/PageBuilder/module.json
{
    "name": "PageBuilder",
    "alias": "page-builder",
    "description": "AI-powered visual page builder with GrapesJS drag-and-drop editor",
    "priority": 0,
    "providers": [
        "Modules\\PageBuilder\\Providers\\PageBuilderServiceProvider",
        "Modules\\PageBuilder\\Providers\\RouteServiceProvider"
    ],
    "dependencies": [],
    "files": []
}
```

- [ ] **Step 4: Create PageBuilderServiceProvider**

```php
<?php
// Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php
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
        $this->loadViewsFrom(module_path($this->moduleName, 'resources/views'), $this->moduleNameLower);
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
```

- [ ] **Step 5: Create RouteServiceProvider**

```php
<?php
// Modules/PageBuilder/app/Providers/RouteServiceProvider.php
declare(strict_types=1);

namespace Modules\PageBuilder\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/admin.php'));
        $this->loadRoutesFrom(module_path('PageBuilder', 'routes/web.php'));
    }
}
```

- [ ] **Step 6: Create config file**

```php
<?php
// Modules/PageBuilder/config/page-builder.php
declare(strict_types=1);

return [
    'auto_save_interval' => env('PAGE_BUILDER_AUTO_SAVE_INTERVAL', 30),
    'compilation' => [
        'minify_html' => true,
        'minify_css' => true,
        'purge_css' => true,
    ],
    'public_route_prefix' => 'p',
];
```

- [ ] **Step 7: Create route files**

```php
<?php
// Modules/PageBuilder/routes/admin.php
declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\Admin\PageBuilderController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/page-builder')
    ->name('admin.page-builder.')
    ->group(function () {
        Route::get('/', [PageBuilderController::class, 'index'])->name('index');
    });
```

```php
<?php
// Modules/PageBuilder/routes/web.php
declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\PublicPageController;

Route::middleware(['web'])
    ->prefix(config('page-builder.public_route_prefix', 'p'))
    ->name('page-builder.public.')
    ->group(function () {
        Route::get('/{slug}', [PublicPageController::class, 'show'])->name('show');
    });
```

- [ ] **Step 8: Create stub controller (enough for test to pass)**

```php
<?php
// Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PageBuilderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/index', [
            'pages' => [],
        ]);
    }
}
```

```php
<?php
// Modules/PageBuilder/app/Http/Controllers/PublicPageController.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers;

use App\Http\Controllers\Controller;

class PublicPageController extends Controller
{
    public function show(string $slug): void
    {
        abort(404); // Implemented in Task 6
    }
}
```

- [ ] **Step 9: Create stub repository interface + implementation (needed for service provider)**

```php
<?php
// Modules/PageBuilder/app/Repositories/BuilderPageRepositoryInterface.php
declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

interface BuilderPageRepositoryInterface
{
}
```

```php
<?php
// Modules/PageBuilder/app/Repositories/BuilderPageRepository.php
declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

class BuilderPageRepository implements BuilderPageRepositoryInterface
{
}
```

- [ ] **Step 10: Create module entry point**

```tsx
// Modules/PageBuilder/resources/js/app.tsx
// PageBuilder module Vite entry point
```

- [ ] **Step 11: Create stub index page**

```tsx
// Modules/PageBuilder/resources/js/pages/admin/page-builder/index.tsx
import AdminLayout from '@/layouts/admin-layout';
import React from 'react';

export default function PageBuilderIndex() {
    return (
        <AdminLayout title="Page Builder">
            <div>Page Builder index — coming soon</div>
        </AdminLayout>
    );
}
```

- [ ] **Step 12: Enable module in modules_statuses.json**

Add `"PageBuilder": true` to the existing `modules_statuses.json`.

- [ ] **Step 13: Run tests**

```bash
php artisan test --filter=PageBuilderModuleTest
```
Expected: All 5 tests PASS.

- [ ] **Step 14: Commit**

```bash
git add Modules/PageBuilder/ modules_statuses.json
git commit -m "feat(page-builder): scaffold PageBuilder module with providers, routes, and permissions"
```

---

## Task 2: Database — Migrations & Models

**Files:**
- Create: `Modules/PageBuilder/database/migrations/2026_03_24_000001_add_editor_mode_to_posts_table.php`
- Create: `Modules/PageBuilder/database/migrations/2026_03_24_000002_create_builder_pages_table.php`
- Create: `Modules/PageBuilder/database/migrations/2026_03_24_000003_create_section_templates_table.php`
- Create: `Modules/PageBuilder/app/Models/BuilderPage.php`
- Create: `Modules/PageBuilder/app/Models/SectionTemplate.php`
- Modify: `app/Models/Post.php` (add relationship + fillable + cast)
- Test: `Modules/PageBuilder/tests/Feature/PageBuilderCrudTest.php` (model tests only)

- [ ] **Step 1: Write model relationship tests**

```php
<?php
// Modules/PageBuilder/tests/Feature/PageBuilderCrudTest.php
declare(strict_types=1);

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use App\Models\Role;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Models\SectionTemplate;

describe('BuilderPage model', function () {
    it('belongs to a post', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $user->id,
        ]);

        $builderPage = BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['components' => []],
            'grapes_css' => '',
        ]);

        expect($builderPage->post)->toBeInstanceOf(Post::class);
        expect($builderPage->post->id)->toBe($post->id);
    });

    it('is accessible from post via hasOne', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $user->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['components' => []],
            'grapes_css' => '',
        ]);

        $freshPost = $post->fresh();
        expect($freshPost->builderPage)->toBeInstanceOf(BuilderPage::class);
    });

    it('stores and retrieves grapes_data as JSON', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'author_id' => $user->id,
        ]);

        $grapesData = [
            'components' => [
                ['type' => 'text', 'content' => 'Hello World'],
            ],
        ];

        $builderPage = BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => $grapesData,
            'grapes_css' => '.text { color: red; }',
        ]);

        $fresh = $builderPage->fresh();
        expect($fresh->grapes_data)->toBe($grapesData);
        expect($fresh->grapes_css)->toBe('.text { color: red; }');
    });
});

describe('SectionTemplate model', function () {
    it('can be created with all fields', function () {
        $template = SectionTemplate::create([
            'name' => 'Hero with CTA',
            'slug' => 'hero-with-cta',
            'category' => 'hero',
            'html_template' => '<section class="hero"><h1>Title</h1></section>',
            'css_template' => '.hero { padding: 4rem; }',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        expect($template->name)->toBe('Hero with CTA');
        expect($template->category)->toBe('hero');
        expect($template->is_active)->toBeTrue();
    });

    it('scopes to active templates', function () {
        SectionTemplate::create([
            'name' => 'Active', 'slug' => 'active', 'category' => 'hero',
            'html_template' => '<div></div>', 'css_template' => '',
            'is_active' => true, 'sort_order' => 1,
        ]);
        SectionTemplate::create([
            'name' => 'Inactive', 'slug' => 'inactive', 'category' => 'hero',
            'html_template' => '<div></div>', 'css_template' => '',
            'is_active' => false, 'sort_order' => 2,
        ]);

        expect(SectionTemplate::where('is_active', true)->count())->toBe(1);
    });
});

describe('Post editor_mode', function () {
    it('defaults to tiptap', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'author_id' => $user->id,
        ]);

        expect($post->editor_mode)->toBe('tiptap');
    });

    it('can be set to builder', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $user->id,
        ]);

        expect($post->editor_mode)->toBe('builder');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --filter=PageBuilderCrudTest
```
Expected: FAIL — tables and models don't exist.

- [ ] **Step 3: Create migrations**

Migration 1 — add `editor_mode` to posts:
```php
<?php
// Modules/PageBuilder/database/migrations/2026_03_24_000001_add_editor_mode_to_posts_table.php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('editor_mode', 20)->default('tiptap')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('editor_mode');
        });
    }
};
```

Migration 2 — `builder_pages` table:
```php
<?php
// Modules/PageBuilder/database/migrations/2026_03_24_000002_create_builder_pages_table.php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('builder_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->unique()->constrained('posts')->cascadeOnDelete();
            $table->json('grapes_data')->nullable();
            $table->longText('grapes_css')->nullable();
            $table->longText('compiled_html')->nullable();
            $table->longText('compiled_css')->nullable();
            $table->timestamp('compiled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builder_pages');
    }
};
```

Migration 3 — `section_templates` table:
```php
<?php
// Modules/PageBuilder/database/migrations/2026_03_24_000003_create_section_templates_table.php
declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('section_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category', 50)->index();
            $table->string('thumbnail')->nullable();
            $table->json('grapes_data')->nullable();
            $table->longText('html_template');
            $table->longText('css_template')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('section_templates');
    }
};
```

- [ ] **Step 4: Create BuilderPage model**

```php
<?php
// Modules/PageBuilder/app/Models/BuilderPage.php
declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuilderPage extends Model
{
    protected $fillable = [
        'post_id',
        'grapes_data',
        'grapes_css',
        'compiled_html',
        'compiled_css',
        'compiled_at',
    ];

    protected function casts(): array
    {
        return [
            'grapes_data' => 'array',
            'compiled_at' => 'datetime',
        ];
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function isCompiled(): bool
    {
        return $this->compiled_at !== null && $this->compiled_html !== null;
    }
}
```

- [ ] **Step 5: Create SectionTemplate model**

```php
<?php
// Modules/PageBuilder/app/Models/SectionTemplate.php
declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SectionTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'thumbnail',
        'grapes_data',
        'html_template',
        'css_template',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'grapes_data' => 'array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }
}
```

- [ ] **Step 6: Modify Post model**

Add to `app/Models/Post.php`:
- Add `'editor_mode'` to `$fillable` array
- Add `'editor_mode'` cast (string, default handled by migration)
- Add `builderPage()` relationship

```php
// In Post::$fillable, add 'editor_mode' after 'status'
// In Post::casts(), add: 'editor_mode' => 'string'
// Add new method:
public function builderPage(): HasOne
{
    return $this->hasOne(\Modules\PageBuilder\Models\BuilderPage::class);
}
```

Also add `use Illuminate\Database\Eloquent\Relations\HasOne;` to imports.

- [ ] **Step 7: Run migrations**

```bash
php artisan migrate
```
Expected: 3 migrations run successfully.

- [ ] **Step 8: Run tests**

```bash
php artisan test --filter=PageBuilderCrudTest
```
Expected: All tests PASS.

- [ ] **Step 9: Commit**

```bash
git add Modules/PageBuilder/database/ Modules/PageBuilder/app/Models/ Modules/PageBuilder/tests/ app/Models/Post.php
git commit -m "feat(page-builder): add migrations, models, and Post relationship"
```

---

## Task 3: Repository & Service Layer

**Files:**
- Modify: `Modules/PageBuilder/app/Repositories/BuilderPageRepositoryInterface.php`
- Modify: `Modules/PageBuilder/app/Repositories/BuilderPageRepository.php`
- Create: `Modules/PageBuilder/app/Services/PageBuilderService.php`
- Create: `Modules/PageBuilder/app/Services/SectionTemplateService.php`

- [ ] **Step 1: Implement repository interface**

```php
<?php
// Modules/PageBuilder/app/Repositories/BuilderPageRepositoryInterface.php
declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BuilderPage;

interface BuilderPageRepositoryInterface
{
    public function findByPostId(int $postId): ?BuilderPage;

    public function create(array $data): BuilderPage;

    public function update(int $id, array $data): BuilderPage;

    public function deleteByPostId(int $postId): bool;
}
```

- [ ] **Step 2: Implement repository**

```php
<?php
// Modules/PageBuilder/app/Repositories/BuilderPageRepository.php
declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BuilderPage;

class BuilderPageRepository implements BuilderPageRepositoryInterface
{
    public function findByPostId(int $postId): ?BuilderPage
    {
        return BuilderPage::where('post_id', $postId)->first();
    }

    public function create(array $data): BuilderPage
    {
        return BuilderPage::create($data);
    }

    public function update(int $id, array $data): BuilderPage
    {
        $builderPage = BuilderPage::findOrFail($id);
        $builderPage->update($data);

        return $builderPage->fresh();
    }

    public function deleteByPostId(int $postId): bool
    {
        return BuilderPage::where('post_id', $postId)->delete() > 0;
    }
}
```

- [ ] **Step 3: Create PageBuilderService**

```php
<?php
// Modules/PageBuilder/app/Services/PageBuilderService.php
declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Services\PostService;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Repositories\BuilderPageRepositoryInterface;

class PageBuilderService
{
    public function __construct(
        private readonly BuilderPageRepositoryInterface $builderPageRepository,
        private readonly PostService $postService,
        private readonly PageCompilerService $compilerService,
    ) {}

    /**
     * Create a new builder page.
     */
    public function createPage(array $data): Post
    {
        $post = $this->postService->createPost(
            [
                'title' => $data['title'],
                'slug' => $data['slug'] ?? '',
                'status' => PostStatus::Draft->value,
                'editor_mode' => 'builder',
                'content' => null,
            ],
            PostType::Page,
        );

        return $post;
    }

    /**
     * Save GrapesJS editor state (auto-save or manual save).
     */
    public function saveEditorState(int $postId, array $grapesData, string $grapesCss): BuilderPage
    {
        $existing = $this->builderPageRepository->findByPostId($postId);

        if ($existing) {
            return $this->builderPageRepository->update($existing->id, [
                'grapes_data' => $grapesData,
                'grapes_css' => $grapesCss,
            ]);
        }

        return $this->builderPageRepository->create([
            'post_id' => $postId,
            'grapes_data' => $grapesData,
            'grapes_css' => $grapesCss,
        ]);
    }

    /**
     * Compile and publish a builder page.
     */
    public function publishPage(int $postId): Post
    {
        $builderPage = $this->builderPageRepository->findByPostId($postId);

        if ($builderPage === null) {
            throw new \RuntimeException('No builder page data found for post ' . $postId);
        }

        $this->compilerService->compile($builderPage);
        $this->postService->publishPost($postId);

        return Post::with('builderPage')->findOrFail($postId);
    }

    /**
     * Get a builder page by post ID.
     */
    public function getBuilderPage(int $postId): ?BuilderPage
    {
        return $this->builderPageRepository->findByPostId($postId);
    }
}
```

- [ ] **Step 4: Create SectionTemplateService**

```php
<?php
// Modules/PageBuilder/app/Services/SectionTemplateService.php
declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateService
{
    /**
     * Get all active templates grouped by category.
     *
     * @return array<string, Collection>
     */
    public function getGroupedByCategory(): array
    {
        return SectionTemplate::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category')
            ->toArray();
    }

    /**
     * Get all active templates as a flat list.
     */
    public function getActive(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Get templates by category.
     */
    public function getByCategory(string $category): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->byCategory($category)
            ->orderBy('sort_order')
            ->get();
    }
}
```

- [ ] **Step 5: Create stub PageCompilerService (full implementation in Task 5)**

```php
<?php
// Modules/PageBuilder/app/Services/PageCompilerService.php
declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Modules\PageBuilder\Models\BuilderPage;

class PageCompilerService
{
    /**
     * Compile GrapesJS data into static HTML+CSS.
     */
    public function compile(BuilderPage $builderPage): BuilderPage
    {
        // Stub — implemented in Task 5
        $builderPage->update([
            'compiled_html' => '',
            'compiled_css' => '',
            'compiled_at' => now(),
        ]);

        return $builderPage->fresh();
    }
}
```

- [ ] **Step 6: Run all tests**

```bash
php artisan test --filter=PageBuilder
```
Expected: All existing tests still PASS.

- [ ] **Step 7: Commit**

```bash
git add Modules/PageBuilder/app/Repositories/ Modules/PageBuilder/app/Services/
git commit -m "feat(page-builder): add repository, service layer, and template service"
```

---

## Task 4: Admin CRUD Controller & Routes

**Files:**
- Modify: `Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php`
- Create: `Modules/PageBuilder/app/Http/Requests/StorePageRequest.php`
- Create: `Modules/PageBuilder/app/Http/Requests/UpdatePageRequest.php`
- Modify: `Modules/PageBuilder/routes/admin.php`
- Test: Add CRUD tests to `Modules/PageBuilder/tests/Feature/PageBuilderCrudTest.php`

- [ ] **Step 1: Add CRUD tests**

Append to `PageBuilderCrudTest.php`:

```php
describe('PageBuilder CRUD', function () {
    beforeEach(function () {
        $this->adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    });

    it('creates a new builder page', function () {
        $response = $this->actingAs($this->admin)->post('/admin/page-builder', [
            'title' => 'My Landing Page',
        ]);

        $response->assertCreated();

        $post = Post::where('title', 'My Landing Page')->first();
        expect($post)->not->toBeNull();
        expect($post->editor_mode)->toBe('builder');
        expect($post->type->value)->toBe('page');
    });

    it('saves editor state (auto-save)', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/page-builder/{$post->id}", [
            'grapes_data' => ['components' => [['type' => 'text']]],
            'grapes_css' => '.text { color: red; }',
        ]);

        $response->assertOk();

        $builderPage = BuilderPage::where('post_id', $post->id)->first();
        expect($builderPage)->not->toBeNull();
        expect($builderPage->grapes_data)->toBe(['components' => [['type' => 'text']]]);
    });

    it('loads the editor page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/admin/page-builder/{$post->id}/editor");

        $response->assertOk();
    });

    it('deletes a builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => [],
            'grapes_css' => '',
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/admin/page-builder/{$post->id}");

        $response->assertOk();
        expect(Post::find($post->id))->toBeNull();
        expect(BuilderPage::where('post_id', $post->id)->first())->toBeNull();
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --filter="PageBuilder CRUD"
```
Expected: FAIL — routes and controller methods don't exist.

- [ ] **Step 3: Create form requests**

```php
<?php
// Modules/PageBuilder/app/Http/Requests/StorePageRequest.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
        ];
    }
}
```

```php
<?php
// Modules/PageBuilder/app/Http/Requests/UpdatePageRequest.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'grapes_data' => ['required', 'array'],
            'grapes_css' => ['nullable', 'string'],
        ];
    }
}
```

- [ ] **Step 4: Implement full controller**

```php
<?php
// Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PageBuilder\Http\Requests\StorePageRequest;
use Modules\PageBuilder\Http\Requests\UpdatePageRequest;
use Modules\PageBuilder\Services\PageBuilderService;
use Modules\PageBuilder\Services\SectionTemplateService;

class PageBuilderController extends Controller
{
    public function __construct(
        private readonly PageBuilderService $pageBuilderService,
        private readonly SectionTemplateService $sectionTemplateService,
    ) {}

    public function index(): Response
    {
        $pages = Post::query()
            ->where('editor_mode', 'builder')
            ->where('type', 'page')
            ->with('author')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('PageBuilder::admin/page-builder/index', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/create');
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $post = $this->pageBuilderService->createPage($request->validated());

        return response()->json([
            'message' => 'Page created successfully',
            'data' => $post,
        ], 201);
    }

    public function editor(Post $post): Response
    {
        $builderPage = $this->pageBuilderService->getBuilderPage($post->id);
        $templates = $this->sectionTemplateService->getGroupedByCategory();

        return Inertia::render('PageBuilder::admin/page-builder/editor', [
            'post' => $post,
            'builderPage' => $builderPage,
            'sectionTemplates' => $templates,
        ]);
    }

    public function update(UpdatePageRequest $request, Post $post): JsonResponse
    {
        $builderPage = $this->pageBuilderService->saveEditorState(
            $post->id,
            $request->validated('grapes_data'),
            $request->validated('grapes_css', ''),
        );

        return response()->json([
            'message' => 'Saved',
            'data' => $builderPage,
        ]);
    }

    public function publish(Post $post): JsonResponse
    {
        $post = $this->pageBuilderService->publishPage($post->id);

        return response()->json([
            'message' => 'Page published',
            'data' => $post,
        ]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Page deleted']);
    }
}
```

- [ ] **Step 5: Update admin routes**

```php
<?php
// Modules/PageBuilder/routes/admin.php
declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\Admin\PageBuilderController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/page-builder')
    ->name('admin.page-builder.')
    ->group(function () {
        Route::get('/', [PageBuilderController::class, 'index'])->name('index');
        Route::get('/create', [PageBuilderController::class, 'create'])->name('create');
        Route::post('/', [PageBuilderController::class, 'store'])->name('store');
        Route::get('/{post}/editor', [PageBuilderController::class, 'editor'])->name('editor');
        Route::put('/{post}', [PageBuilderController::class, 'update'])->name('update');
        Route::post('/{post}/publish', [PageBuilderController::class, 'publish'])->name('publish');
        Route::delete('/{post}', [PageBuilderController::class, 'destroy'])->name('destroy');
    });
```

- [ ] **Step 6: Run tests**

```bash
php artisan test --filter="PageBuilder CRUD"
```
Expected: All CRUD tests PASS.

- [ ] **Step 7: Commit**

```bash
git add Modules/PageBuilder/app/Http/ Modules/PageBuilder/routes/ Modules/PageBuilder/tests/
git commit -m "feat(page-builder): add admin CRUD controller, routes, and form requests"
```

---

## Task 5: Page Compilation Pipeline

**Files:**
- Modify: `Modules/PageBuilder/app/Services/PageCompilerService.php`
- Test: `Modules/PageBuilder/tests/Feature/PageCompilerTest.php`

- [ ] **Step 1: Write compilation tests**

```php
<?php
// Modules/PageBuilder/tests/Feature/PageCompilerTest.php
declare(strict_types=1);

use App\Enums\PostType;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Services\PageCompilerService;

describe('PageCompilerService', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $this->post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $user->id,
        ]);
    });

    it('compiles grapes data into HTML and CSS', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<section class="hero"><h1>Welcome</h1><p>Hello world</p></section>',
                'css' => '.hero { padding: 2rem; background: #f0f0f0; } .hero h1 { font-size: 2rem; }',
            ],
            'grapes_css' => '.hero { padding: 2rem; background: #f0f0f0; } .hero h1 { font-size: 2rem; }',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_html)->not->toBeNull()->not->toBeEmpty();
        expect($compiled->compiled_css)->not->toBeNull();
        expect($compiled->compiled_at)->not->toBeNull();
        expect($compiled->compiled_html)->toContain('Welcome');
        expect($compiled->compiled_html)->toContain('Hello world');
    });

    it('sanitizes HTML output', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<section><h1>Title</h1><script>alert("xss")</script></section>',
                'css' => '',
            ],
            'grapes_css' => '',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_html)->not->toContain('<script>');
        expect($compiled->compiled_html)->toContain('Title');
    });

    it('handles empty grapes data gracefully', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => ['html' => '', 'css' => ''],
            'grapes_css' => '',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_at)->not->toBeNull();
        expect($compiled->compiled_html)->toBe('');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --filter=PageCompilerTest
```
Expected: FAIL — compiler is a stub.

- [ ] **Step 3: Implement PageCompilerService**

```php
<?php
// Modules/PageBuilder/app/Services/PageCompilerService.php
declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Modules\PageBuilder\Models\BuilderPage;

class PageCompilerService
{
    /**
     * Compile GrapesJS data into static HTML+CSS.
     *
     * GrapesJS stores the editor state as:
     * - grapes_data['html']: The HTML output from grapesjs editor.getHtml()
     * - grapes_data['css'] or grapes_css: The CSS from editor.getCss()
     */
    public function compile(BuilderPage $builderPage): BuilderPage
    {
        $grapesData = $builderPage->grapes_data ?? [];
        $html = $grapesData['html'] ?? '';
        $css = $grapesData['css'] ?? $builderPage->grapes_css ?? '';

        // Sanitize HTML to remove XSS vectors
        $sanitizedHtml = $this->sanitizeHtml($html);

        // Minify if configured
        if (config('page-builder.compilation.minify_html', true)) {
            $sanitizedHtml = $this->minifyHtml($sanitizedHtml);
        }

        if (config('page-builder.compilation.minify_css', true)) {
            $css = $this->minifyCss($css);
        }

        $builderPage->update([
            'compiled_html' => $sanitizedHtml,
            'compiled_css' => $css,
            'compiled_at' => now(),
        ]);

        return $builderPage->fresh();
    }

    /**
     * Sanitize HTML by stripping dangerous tags and attributes.
     */
    private function sanitizeHtml(string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // Strip script tags and their content
        $html = preg_replace('#<script\b[^>]*>.*?</script>#is', '', $html);

        // Strip event handlers (onclick, onerror, etc.)
        $html = preg_replace('/\s+on\w+\s*=\s*["\'][^"\']*["\']/i', '', $html);

        // Strip iframe tags
        $html = preg_replace('#<iframe\b[^>]*>.*?</iframe>#is', '', $html);

        // Strip object/embed tags
        $html = preg_replace('#<(object|embed)\b[^>]*>.*?</\1>#is', '', $html);

        return $html;
    }

    /**
     * Basic HTML minification — collapse whitespace.
     */
    private function minifyHtml(string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // Collapse multiple whitespace into single space
        $html = preg_replace('/\s+/', ' ', $html);

        // Remove spaces between tags
        $html = preg_replace('/>\s+</', '><', $html);

        return trim($html);
    }

    /**
     * Basic CSS minification.
     */
    private function minifyCss(string $css): string
    {
        if (empty($css)) {
            return '';
        }

        // Remove comments
        $css = preg_replace('/\/\*.*?\*\//s', '', $css);

        // Collapse whitespace
        $css = preg_replace('/\s+/', ' ', $css);

        // Remove spaces around selectors and properties
        $css = preg_replace('/\s*([{}:;,])\s*/', '$1', $css);

        return trim($css);
    }
}
```

- [ ] **Step 4: Run tests**

```bash
php artisan test --filter=PageCompilerTest
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add Modules/PageBuilder/app/Services/PageCompilerService.php Modules/PageBuilder/tests/Feature/PageCompilerTest.php
git commit -m "feat(page-builder): implement page compilation pipeline with HTML sanitization"
```

---

## Task 6: Public Page Rendering

**Files:**
- Modify: `Modules/PageBuilder/app/Http/Controllers/PublicPageController.php`
- Create: `Modules/PageBuilder/resources/views/page.blade.php`
- Test: `Modules/PageBuilder/tests/Feature/PublicPageTest.php`

- [ ] **Step 1: Write public rendering tests**

```php
<?php
// Modules/PageBuilder/tests/Feature/PublicPageTest.php
declare(strict_types=1);

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BuilderPage;

describe('Public page rendering', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->user = User::factory()->create(['role_id' => $adminRole->id]);
    });

    it('renders a published builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'status' => PostStatus::Published->value,
            'slug' => 'landing-page',
            'title' => 'My Landing Page',
            'meta_title' => 'Landing Page | My Site',
            'meta_description' => 'A great landing page',
            'published_at' => now(),
            'author_id' => $this->user->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['html' => '<section><h1>Welcome</h1></section>'],
            'grapes_css' => '',
            'compiled_html' => '<section><h1>Welcome</h1></section>',
            'compiled_css' => 'section{padding:2rem}',
            'compiled_at' => now(),
        ]);

        $response = $this->get('/p/landing-page');

        $response->assertOk();
        $response->assertSee('Welcome');
        $response->assertSee('section{padding:2rem}');
        $response->assertSee('Landing Page | My Site');
    });

    it('returns 404 for non-existent slug', function () {
        $this->get('/p/does-not-exist')->assertNotFound();
    });

    it('returns 404 for unpublished builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'status' => PostStatus::Draft->value,
            'slug' => 'draft-page',
            'author_id' => $this->user->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => [],
            'grapes_css' => '',
            'compiled_html' => '<h1>Draft</h1>',
            'compiled_css' => '',
            'compiled_at' => now(),
        ]);

        $this->get('/p/draft-page')->assertNotFound();
    });

    it('returns 404 for non-builder pages', function () {
        Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'tiptap',
            'status' => PostStatus::Published->value,
            'slug' => 'tiptap-page',
            'published_at' => now(),
            'author_id' => $this->user->id,
        ]);

        $this->get('/p/tiptap-page')->assertNotFound();
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --filter=PublicPageTest
```
Expected: FAIL — controller returns 404 stub.

- [ ] **Step 3: Implement PublicPageController**

```php
<?php
// Modules/PageBuilder/app/Http/Controllers/PublicPageController.php
declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\View\View;

class PublicPageController extends Controller
{
    public function show(string $slug): View
    {
        $post = Post::query()
            ->where('slug', $slug)
            ->where('type', 'page')
            ->where('editor_mode', 'builder')
            ->published()
            ->with('builderPage')
            ->firstOrFail();

        $builderPage = $post->builderPage;

        if ($builderPage === null || ! $builderPage->isCompiled()) {
            abort(404);
        }

        return view('page-builder::page', [
            'post' => $post,
            'builderPage' => $builderPage,
        ]);
    }
}
```

- [ ] **Step 4: Create Blade layout**

```blade
{{-- Modules/PageBuilder/resources/views/page.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $post->meta_title ?? $post->title }}</title>

    @if($post->meta_description)
        <meta name="description" content="{{ $post->meta_description }}">
    @endif

    <meta property="og:title" content="{{ $post->meta_title ?? $post->title }}">
    @if($post->meta_description)
        <meta property="og:description" content="{{ $post->meta_description }}">
    @endif

    @if($builderPage->compiled_css)
        <style>{!! $builderPage->compiled_css !!}</style>
    @endif
</head>
<body>
    {!! $builderPage->compiled_html !!}
</body>
</html>
```

- [ ] **Step 5: Run tests**

```bash
php artisan test --filter=PublicPageTest
```
Expected: All PASS.

- [ ] **Step 6: Commit**

```bash
git add Modules/PageBuilder/app/Http/Controllers/PublicPageController.php Modules/PageBuilder/resources/views/ Modules/PageBuilder/tests/Feature/PublicPageTest.php
git commit -m "feat(page-builder): add public page rendering with Blade layout"
```

---

## Task 7: Section Template Seeder

**Files:**
- Create: `Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php`
- Test: `Modules/PageBuilder/tests/Feature/SectionTemplateTest.php`

- [ ] **Step 1: Write seeder tests**

```php
<?php
// Modules/PageBuilder/tests/Feature/SectionTemplateTest.php
declare(strict_types=1);

use Modules\PageBuilder\Models\SectionTemplate;

describe('SectionTemplate seeder', function () {
    it('seeds hero section templates', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);

        $heroTemplates = SectionTemplate::where('category', 'hero')->get();
        expect($heroTemplates->count())->toBeGreaterThanOrEqual(3);
    });

    it('seeds templates with valid HTML', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);

        $templates = SectionTemplate::all();
        expect($templates->count())->toBeGreaterThan(0);

        $templates->each(function (SectionTemplate $template) {
            expect($template->html_template)->not->toBeEmpty();
            expect($template->name)->not->toBeEmpty();
            expect($template->slug)->not->toBeEmpty();
            expect($template->category)->not->toBeEmpty();
        });
    });

    it('does not duplicate on re-run', function () {
        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);
        $countFirst = SectionTemplate::count();

        $this->artisan('db:seed', [
            '--class' => 'Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder',
        ]);
        $countSecond = SectionTemplate::count();

        expect($countSecond)->toBe($countFirst);
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
php artisan test --filter=SectionTemplateTest
```
Expected: FAIL — seeder doesn't exist.

- [ ] **Step 3: Create SectionTemplateSeeder**

Create `Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php` with initial templates. Use `updateOrCreate` keyed on `slug` to prevent duplicates.

Include starter templates for these categories (3 per category as MVP):
- **hero** (3): full-width-hero, split-hero, centered-hero
- **features** (3): icon-grid-features, alternating-features, feature-cards
- **cta** (2): banner-cta, split-cta
- **content** (2): text-block, text-image-split

Each template should:
- Use CSS custom properties: `--section-bg`, `--section-text`, `--section-accent`, `--section-spacing`
- Be responsive by default with flexbox/grid
- Contain realistic placeholder text

Total: ~10 starter templates (remaining 34 added in SP2).

```php
<?php
// Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php
declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = $this->getTemplates();

        foreach ($templates as $template) {
            SectionTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template,
            );
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function getTemplates(): array
    {
        return [
            // HERO SECTIONS
            [
                'name' => 'Full Width Hero',
                'slug' => 'full-width-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-full" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 6rem) 2rem; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><h1 style="font-size: 3rem; margin-bottom: 1rem;">Build Something Amazing</h1><p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">Create beautiful, responsive pages with our drag-and-drop builder. No coding required.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Get Started</a></div></section>',
                'css_template' => '.pb-hero-full { min-height: 60vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Split Hero',
                'slug' => 'split-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-split" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #1a1a2e); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Your Story Starts Here</h1><p style="font-size: 1.125rem; opacity: 0.8; margin-bottom: 1.5rem;">Craft compelling pages that convert visitors into customers with our intuitive builder.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Learn More</a></div><div style="background: #f0f0f0; border-radius: 1rem; height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-hero-split > div { grid-template-columns: 1fr !important; text-align: center; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Centered Hero',
                'slug' => 'centered-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-centered" style="background: linear-gradient(135deg, var(--section-bg, #667eea), var(--section-accent, #764ba2)); color: var(--section-text, #ffffff); padding: var(--section-spacing, 5rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h1 style="font-size: 2.75rem; margin-bottom: 1rem;">Elegant. Simple. Powerful.</h1><p style="font-size: 1.125rem; opacity: 0.9; margin-bottom: 2rem;">Everything you need to build stunning pages, all in one place.</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="#" style="background: #fff; color: #333; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Primary Action</a><a href="#" style="background: transparent; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 2px solid rgba(255,255,255,0.5);">Secondary</a></div></div></section>',
                'css_template' => '.pb-hero-centered { min-height: 50vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'sort_order' => 3,
            ],

            // FEATURES SECTIONS
            [
                'name' => 'Icon Grid Features',
                'slug' => 'icon-grid-features',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Why Choose Us</h2><p style="opacity: 0.7; margin-bottom: 3rem;">Everything you need to succeed</p><div class="pb-features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;"><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">✦</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fast Performance</h3><p style="opacity: 0.7;">Lightning-fast load times that keep your visitors engaged.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">◈</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Easy to Use</h3><p style="opacity: 0.7;">Intuitive drag-and-drop interface anyone can master.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">⬡</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fully Responsive</h3><p style="opacity: 0.7;">Looks perfect on every device, from mobile to desktop.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-features-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Alternating Features',
                'slug' => 'alternating-features',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 3rem;"><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Drag & Drop Builder</h3><p style="opacity: 0.8; line-height: 1.6;">Build beautiful pages visually with our intuitive editor. No code needed — just drag, drop, and customize.</p></div><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div></div><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">AI-Powered Content</h3><p style="opacity: 0.8; line-height: 1.6;">Let AI generate and optimize your content based on your brand identity and audience.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-alt-feature { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Feature Cards',
                'slug' => 'feature-cards',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 2.5rem;">Powerful Features</h2><div class="pb-feature-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Templates Library</h3><p style="opacity: 0.7; font-size: 0.875rem;">Choose from dozens of pre-built sections to jumpstart your design.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Style Presets</h3><p style="opacity: 0.7; font-size: 0.875rem;">Keep your brand consistent with curated color, font, and spacing presets.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">One-Click Publish</h3><p style="opacity: 0.7; font-size: 0.875rem;">Compile to static HTML for blazing-fast, SEO-friendly pages.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-feature-cards { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 3,
            ],

            // CTA SECTIONS
            [
                'name' => 'Banner CTA',
                'slug' => 'banner-cta',
                'category' => 'cta',
                'html_template' => '<section style="background: var(--section-accent, #e94560); color: #ffffff; padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Ready to Get Started?</h2><p style="opacity: 0.9; margin-bottom: 1.5rem;">Join thousands of creators building beautiful pages today.</p><a href="#" style="display: inline-block; background: #fff; color: #333; padding: 0.75rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Start Building</a></div></section>',
                'css_template' => '',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Split CTA',
                'slug' => 'split-cta',
                'category' => 'cta',
                'html_template' => '<section class="pb-split-cta" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;"><div><h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Start Your Free Trial</h2><p style="opacity: 0.7;">No credit card required. Cancel anytime.</p></div><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; white-space: nowrap;">Get Started Free</a></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-split-cta > div { text-align: center; width: 100%; } .pb-split-cta { justify-content: center !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],

            // CONTENT SECTIONS
            [
                'name' => 'Text Block',
                'slug' => 'text-block',
                'category' => 'content',
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 1.5rem;">About Our Mission</h2><p style="line-height: 1.8; margin-bottom: 1rem;">We believe that everyone should have the tools to create beautiful, professional web pages without needing to write code. Our page builder puts the power of design in your hands.</p><p style="line-height: 1.8;">With an intuitive drag-and-drop interface, pre-built templates, and AI-powered content generation, you can go from idea to published page in minutes — not days.</p></div></section>',
                'css_template' => '',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Text + Image Split',
                'slug' => 'text-image-split',
                'category' => 'content',
                'html_template' => '<section class="pb-text-image" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Built for Speed</h2><p style="line-height: 1.7; opacity: 0.8;">Pages built with our builder compile to static HTML — no JavaScript runtime, no heavy frameworks. Just clean, fast-loading pages that search engines love.</p></div><div style="background: #f0f0f0; border-radius: 0.75rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-text-image > div { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];
    }
}
```

- [ ] **Step 4: Run tests**

```bash
php artisan test --filter=SectionTemplateTest
```
Expected: All PASS.

- [ ] **Step 5: Commit**

```bash
git add Modules/PageBuilder/database/seeders/ Modules/PageBuilder/tests/Feature/SectionTemplateTest.php
git commit -m "feat(page-builder): add section template seeder with 10 starter templates"
```

---

## Task 8: GrapesJS Frontend — Editor Foundation

**Files:**
- Create: `Modules/PageBuilder/resources/js/lib/grapes-config.ts`
- Create: `Modules/PageBuilder/resources/js/lib/grapes-blocks.ts`
- Create: `Modules/PageBuilder/resources/js/lib/grapes-plugins.ts`
- Create: `Modules/PageBuilder/resources/js/components/GrapesEditor.tsx`

**Prerequisites:** Install GrapesJS npm packages first.

- [ ] **Step 1: Install GrapesJS**

```bash
npm install grapesjs grapesjs-preset-webpage
```

- [ ] **Step 2: Create GrapesJS config**

```typescript
// Modules/PageBuilder/resources/js/lib/grapes-config.ts
import type { EditorConfig } from 'grapesjs';

export interface PageBuilderConfig {
    container: HTMLElement;
    autoSaveUrl?: string;
    autoSaveInterval?: number;
}

export function createGrapesConfig(config: PageBuilderConfig): EditorConfig {
    return {
        container: config.container,
        height: '100%',
        width: 'auto',
        fromElement: false,
        storageManager: false, // We handle storage manually via Inertia
        canvas: {
            styles: [
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            ],
        },
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' },
                { name: 'Tablet', width: '768px', widthMedia: '768px' },
                { name: 'Mobile', width: '375px', widthMedia: '375px' },
            ],
        },
        panels: { defaults: [] }, // We build custom panels in React
        blockManager: { appendTo: undefined }, // Blocks managed by SectionPanel
        styleManager: { appendTo: undefined }, // Styles managed by StylePresets
        layerManager: { appendTo: undefined },
    };
}
```

- [ ] **Step 3: Create block registration helper**

```typescript
// Modules/PageBuilder/resources/js/lib/grapes-blocks.ts
import type { Editor } from 'grapesjs';

export interface SectionTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    html_template: string;
    css_template: string | null;
    thumbnail: string | null;
}

export function registerSectionBlocks(
    editor: Editor,
    templates: Record<string, SectionTemplate[]>,
): void {
    const blockManager = editor.BlockManager;

    Object.entries(templates).forEach(([category, sections]) => {
        sections.forEach((template) => {
            blockManager.add(`section-${template.slug}`, {
                label: template.name,
                category: category.charAt(0).toUpperCase() + category.slice(1),
                content: {
                    type: 'wrapper',
                    components: template.html_template,
                    styles: template.css_template || '',
                },
                media: template.thumbnail
                    ? `<img src="${template.thumbnail}" alt="${template.name}" />`
                    : `<div style="padding:1rem;text-align:center;font-size:0.75rem;color:#999;">${template.name}</div>`,
            });
        });
    });
}
```

- [ ] **Step 4: Create plugins file (style presets)**

```typescript
// Modules/PageBuilder/resources/js/lib/grapes-plugins.ts
import type { Editor } from 'grapesjs';

/**
 * Custom plugin: constrained style presets.
 * Replaces full CSS control with curated options.
 */
export function stylePresetsPlugin(editor: Editor): void {
    // Add custom trait types for constrained styling
    editor.TraitManager.addType('preset-colors', {
        createInput({ trait }) {
            const el = document.createElement('select');
            const options = [
                { value: '', label: 'Default' },
                { value: '#1a1a2e', label: 'Dark' },
                { value: '#ffffff', label: 'Light' },
                { value: '#f8f9fa', label: 'Gray' },
                { value: '#e94560', label: 'Accent' },
            ];
            options.forEach((opt) => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                el.appendChild(option);
            });
            return el;
        },
    });

    editor.TraitManager.addType('preset-spacing', {
        createInput({ trait }) {
            const el = document.createElement('select');
            const options = [
                { value: '2rem', label: 'Compact' },
                { value: '4rem', label: 'Normal' },
                { value: '6rem', label: 'Spacious' },
            ];
            options.forEach((opt) => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                el.appendChild(option);
            });
            return el;
        },
    });
}

export function devicePreviewPlugin(editor: Editor): void {
    // Device switching commands
    editor.Commands.add('set-device-desktop', {
        run: (e) => e.setDevice('Desktop'),
    });
    editor.Commands.add('set-device-tablet', {
        run: (e) => e.setDevice('Tablet'),
    });
    editor.Commands.add('set-device-mobile', {
        run: (e) => e.setDevice('Mobile'),
    });
}
```

- [ ] **Step 5: Create GrapesEditor React wrapper**

```tsx
// Modules/PageBuilder/resources/js/components/GrapesEditor.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from 'grapesjs';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { createGrapesConfig } from '../lib/grapes-config';
import { registerSectionBlocks, type SectionTemplate } from '../lib/grapes-blocks';
import { devicePreviewPlugin, stylePresetsPlugin } from '../lib/grapes-plugins';

interface GrapesEditorProps {
    initialData?: {
        grapes_data: Record<string, unknown> | null;
        grapes_css: string | null;
    };
    sectionTemplates: Record<string, SectionTemplate[]>;
    onSave: (data: { grapesData: Record<string, unknown>; grapesCss: string }) => void;
    onEditorReady?: (editor: Editor) => void;
}

export default function GrapesEditor({
    initialData,
    sectionTemplates,
    onSave,
    onEditorReady,
}: GrapesEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<Editor | null>(null);
    const [isReady, setIsReady] = useState(false);

    const handleSave = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const grapesData = {
            html: editor.getHtml(),
            css: editor.getCss(),
            components: editor.getComponents(),
            styles: editor.getStyle(),
        };

        onSave({
            grapesData,
            grapesCss: editor.getCss() ?? '',
        });
    }, [onSave]);

    useEffect(() => {
        if (!containerRef.current || editorRef.current) return;

        const config = createGrapesConfig({
            container: containerRef.current,
        });

        const editor = grapesjs.init({
            ...config,
            plugins: [stylePresetsPlugin, devicePreviewPlugin],
        });

        // Load initial data if available
        if (initialData?.grapes_data) {
            const data = initialData.grapes_data;
            if (data.components) {
                editor.setComponents(data.components as string);
            }
            if (data.styles) {
                editor.setStyle(data.styles as string);
            }
        }

        // Register section template blocks
        registerSectionBlocks(editor, sectionTemplates);

        editorRef.current = editor;
        setIsReady(true);

        if (onEditorReady) {
            onEditorReady(editor);
        }

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
    }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div ref={containerRef} style={{ flex: 1 }} />
        </div>
    );
}
```

- [ ] **Step 6: Commit**

```bash
git add Modules/PageBuilder/resources/js/ package.json package-lock.json
git commit -m "feat(page-builder): add GrapesJS editor integration with React wrapper"
```

---

## Task 9: Editor & Index Pages

**Files:**
- Modify: `Modules/PageBuilder/resources/js/pages/admin/page-builder/index.tsx`
- Create: `Modules/PageBuilder/resources/js/pages/admin/page-builder/create.tsx`
- Create: `Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx`
- Create: `Modules/PageBuilder/resources/js/components/SectionPanel.tsx`
- Create: `Modules/PageBuilder/resources/js/components/StylePresets.tsx`

- [ ] **Step 1: Build the index page with DataTable**

```tsx
// Modules/PageBuilder/resources/js/pages/admin/page-builder/index.tsx
import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Badge, Button, Empty, List, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface BuilderPageItem {
    id: number;
    title: string;
    slug: string;
    status: string;
    editor_mode: string;
    updated_at: string;
    author?: { first_name: string; last_name: string };
}

interface Props {
    pages: BuilderPageItem[];
}

export default function PageBuilderIndex({ pages }: Props) {
    const contentHeader: ContentHeaderProps = {
        primaryAction: {
            label: 'New Builder Page',
            icon: 'plus',
            onClick: () => router.visit('/admin/page-builder/create'),
        },
        breadcrumb: [{ title: 'Page Builder', href: '/admin/page-builder' }],
    };

    return (
        <AdminLayout title="Page Builder" contentHeader={contentHeader}>
            <PageCard>
                {pages.length === 0 ? (
                    <Empty description="No builder pages yet">
                        <Button type="primary" onClick={() => router.visit('/admin/page-builder/create')}>
                            Create Your First Page
                        </Button>
                    </Empty>
                ) : (
                    <List
                        dataSource={pages}
                        renderItem={(page) => (
                            <List.Item
                                style={{ cursor: 'pointer' }}
                                className="hover:bg-gray-50"
                                onClick={() => router.visit(`/admin/page-builder/${page.id}/editor`)}
                                extra={
                                    <Tag color={page.status === 'published' ? 'success' : 'default'}>
                                        {page.status}
                                    </Tag>
                                }
                            >
                                <List.Item.Meta
                                    title={page.title}
                                    description={`/p/${page.slug} · Updated ${dayjs(page.updated_at).fromNow()}`}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </PageCard>
        </AdminLayout>
    );
}
```

- [ ] **Step 2: Build the create page**

```tsx
// Modules/PageBuilder/resources/js/pages/admin/page-builder/create.tsx
import type { ContentHeaderProps } from '@/components/ui/ContentHeader';
import PageCard from '@/components/ui/PageCard';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button, Form, Input, message } from 'antd';
import axios from '@/lib/axios';
import React from 'react';

export default function PageBuilderCreate() {
    const [form] = Form.useForm();

    const contentHeader: ContentHeaderProps = {
        breadcrumb: [
            { title: 'Page Builder', href: '/admin/page-builder' },
            { title: 'New Page' },
        ],
    };

    const handleSubmit = async (values: { title: string }) => {
        try {
            const response = await axios.post('/admin/page-builder', values);
            const postId = response.data.data.id;
            router.visit(`/admin/page-builder/${postId}/editor`);
        } catch {
            message.error('Failed to create page');
        }
    };

    return (
        <AdminLayout title="New Builder Page" contentHeader={contentHeader}>
            <PageCard style={{ maxWidth: 600 }}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="Page Title"
                        rules={[{ required: true, message: 'Please enter a page title' }]}
                    >
                        <Input placeholder="My Landing Page" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large">
                            Open in Builder
                        </Button>
                    </Form.Item>
                </Form>
            </PageCard>
        </AdminLayout>
    );
}
```

- [ ] **Step 3: Create SectionPanel component**

```tsx
// Modules/PageBuilder/resources/js/components/SectionPanel.tsx
import type { SectionTemplate } from '../lib/grapes-blocks';
import { Collapse, Input } from 'antd';
import React, { useMemo, useState } from 'react';

interface SectionPanelProps {
    templates: Record<string, SectionTemplate[]>;
}

export default function SectionPanel({ templates }: SectionPanelProps) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return templates;

        const lower = search.toLowerCase();
        const result: Record<string, SectionTemplate[]> = {};

        Object.entries(templates).forEach(([category, sections]) => {
            const matches = sections.filter((s) =>
                s.name.toLowerCase().includes(lower) || category.toLowerCase().includes(lower),
            );
            if (matches.length > 0) result[category] = matches;
        });

        return result;
    }, [templates, search]);

    const items = Object.entries(filtered).map(([category, sections]) => ({
        key: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        children: (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
                {sections.map((template) => (
                    <div
                        key={template.slug}
                        className="gjs-block"
                        data-gjs-slug={`section-${template.slug}`}
                        style={{
                            padding: '0.75rem',
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.375rem',
                            cursor: 'grab',
                            fontSize: '0.875rem',
                        }}
                    >
                        {template.name}
                    </div>
                ))}
            </div>
        ),
    }));

    return (
        <div style={{ padding: '0.5rem', height: '100%', overflow: 'auto' }}>
            <Input.Search
                placeholder="Search sections..."
                size="small"
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: '0.5rem' }}
            />
            <Collapse items={items} defaultActiveKey={Object.keys(filtered)} size="small" />
        </div>
    );
}
```

- [ ] **Step 4: Create StylePresets component**

```tsx
// Modules/PageBuilder/resources/js/components/StylePresets.tsx
import { Select, Space, Typography } from 'antd';
import React from 'react';
import type { Editor } from 'grapesjs';

interface StylePresetsProps {
    editor: Editor | null;
}

const COLOR_PRESETS = [
    { label: 'Light', value: '#ffffff' },
    { label: 'Dark', value: '#1a1a2e' },
    { label: 'Warm Gray', value: '#f8f9fa' },
    { label: 'Accent', value: '#e94560' },
];

const SPACING_PRESETS = [
    { label: 'Compact', value: '2rem' },
    { label: 'Normal', value: '4rem' },
    { label: 'Spacious', value: '6rem' },
];

const FONT_SIZE_PRESETS = [
    { label: 'Small', value: '0.875rem' },
    { label: 'Medium', value: '1rem' },
    { label: 'Large', value: '1.25rem' },
    { label: 'XL', value: '1.5rem' },
];

const RADIUS_PRESETS = [
    { label: 'None', value: '0' },
    { label: 'Small', value: '0.375rem' },
    { label: 'Medium', value: '0.75rem' },
    { label: 'Large', value: '1rem' },
];

export default function StylePresets({ editor }: StylePresetsProps) {
    const applyStyle = (property: string, value: string) => {
        if (!editor) return;
        const selected = editor.getSelected();
        if (selected) {
            selected.addStyle({ [property]: value });
        }
    };

    return (
        <div style={{ padding: '0.75rem' }}>
            <Typography.Text strong style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Style Presets
            </Typography.Text>

            <Space direction="vertical" style={{ width: '100%', marginTop: '0.75rem' }} size="small">
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>Background</Typography.Text>
                    <Select
                        size="small"
                        style={{ width: '100%' }}
                        placeholder="Choose color"
                        options={COLOR_PRESETS}
                        onChange={(v) => applyStyle('background-color', v)}
                    />
                </div>
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>Spacing</Typography.Text>
                    <Select
                        size="small"
                        style={{ width: '100%' }}
                        placeholder="Choose spacing"
                        options={SPACING_PRESETS}
                        onChange={(v) => applyStyle('padding', `${v} 2rem`)}
                    />
                </div>
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>Font Size</Typography.Text>
                    <Select
                        size="small"
                        style={{ width: '100%' }}
                        placeholder="Choose size"
                        options={FONT_SIZE_PRESETS}
                        onChange={(v) => applyStyle('font-size', v)}
                    />
                </div>
                <div>
                    <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>Border Radius</Typography.Text>
                    <Select
                        size="small"
                        style={{ width: '100%' }}
                        placeholder="Choose radius"
                        options={RADIUS_PRESETS}
                        onChange={(v) => applyStyle('border-radius', v)}
                    />
                </div>
            </Space>
        </div>
    );
}
```

- [ ] **Step 5: Build the editor page**

```tsx
// Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx
import axios from '@/lib/axios';
import type { Editor } from 'grapesjs';
import { Button, message, Space, Tooltip } from 'antd';
import { Icon } from '@/components/ui/Icon';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import GrapesEditor from '../../components/GrapesEditor';
import SectionPanel from '../../components/SectionPanel';
import StylePresets from '../../components/StylePresets';
import type { SectionTemplate } from '../../lib/grapes-blocks';

interface Props {
    post: {
        id: number;
        title: string;
        slug: string;
    };
    builderPage: {
        grapes_data: Record<string, unknown> | null;
        grapes_css: string | null;
    } | null;
    sectionTemplates: Record<string, SectionTemplate[]>;
}

export default function PageBuilderEditor({ post, builderPage, sectionTemplates }: Props) {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const save = useCallback(
        async (data: { grapesData: Record<string, unknown>; grapesCss: string }) => {
            setSaving(true);
            try {
                await axios.put(`/admin/page-builder/${post.id}`, {
                    grapes_data: data.grapesData,
                    grapes_css: data.grapesCss,
                });
            } catch {
                message.error('Failed to save');
            } finally {
                setSaving(false);
            }
        },
        [post.id],
    );

    const handlePublish = async () => {
        if (!editor) return;

        // Save first
        await save({
            grapesData: {
                html: editor.getHtml(),
                css: editor.getCss(),
                components: editor.getComponents(),
                styles: editor.getStyle(),
            },
            grapesCss: editor.getCss() ?? '',
        });

        setPublishing(true);
        try {
            await axios.post(`/admin/page-builder/${post.id}/publish`);
            message.success('Page published!');
        } catch {
            message.error('Failed to publish');
        } finally {
            setPublishing(false);
        }
    };

    const handleManualSave = () => {
        if (!editor) return;
        save({
            grapesData: {
                html: editor.getHtml(),
                css: editor.getCss(),
                components: editor.getComponents(),
                styles: editor.getStyle(),
            },
            grapesCss: editor.getCss() ?? '',
        });
    };

    // Auto-save every 30 seconds
    useEffect(() => {
        if (!editor) return;

        autoSaveTimer.current = setInterval(() => {
            handleManualSave();
        }, 30000);

        return () => {
            if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
        };
    }, [editor]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div
                style={{
                    height: 48,
                    background: '#1a1a2e',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Button type="text" size="small" onClick={() => window.history.back()} style={{ color: '#fff' }}>
                        ← Back
                    </Button>
                    <span style={{ fontWeight: 600 }}>{post.title}</span>
                </div>
                <Space>
                    <Tooltip title="Undo">
                        <Button
                            type="text"
                            size="small"
                            style={{ color: '#fff' }}
                            onClick={() => editor?.UndoManager.undo()}
                        >
                            Undo
                        </Button>
                    </Tooltip>
                    <Tooltip title="Redo">
                        <Button
                            type="text"
                            size="small"
                            style={{ color: '#fff' }}
                            onClick={() => editor?.UndoManager.redo()}
                        >
                            Redo
                        </Button>
                    </Tooltip>
                    <Space.Compact>
                        <Button size="small" onClick={() => editor?.runCommand('set-device-desktop')}>Desktop</Button>
                        <Button size="small" onClick={() => editor?.runCommand('set-device-tablet')}>Tablet</Button>
                        <Button size="small" onClick={() => editor?.runCommand('set-device-mobile')}>Mobile</Button>
                    </Space.Compact>
                    <Button size="small" onClick={handleManualSave} loading={saving}>
                        Save
                    </Button>
                    <Button type="primary" size="small" onClick={handlePublish} loading={publishing}>
                        Publish
                    </Button>
                </Space>
            </div>

            {/* Editor Layout */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: Section Panel */}
                <div style={{ width: 240, borderRight: '1px solid #e0e0e0', overflow: 'auto' }}>
                    <SectionPanel templates={sectionTemplates} />
                </div>

                {/* Center: GrapesJS Canvas */}
                <div style={{ flex: 1 }}>
                    <GrapesEditor
                        initialData={builderPage ?? undefined}
                        sectionTemplates={sectionTemplates}
                        onSave={save}
                        onEditorReady={setEditor}
                    />
                </div>

                {/* Right: Style Presets */}
                <div style={{ width: 220, borderLeft: '1px solid #e0e0e0', overflow: 'auto' }}>
                    <StylePresets editor={editor} />
                </div>
            </div>
        </div>
    );
}
```

- [ ] **Step 6: Verify build compiles**

```bash
npm run build
```
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add Modules/PageBuilder/resources/js/
git commit -m "feat(page-builder): add GrapesJS editor page with section panel and style presets"
```

---

## Task 10: Run Full Test Suite & Lint

- [ ] **Step 1: Run all PageBuilder tests**

```bash
php artisan test --filter=PageBuilder
```
Expected: All tests PASS.

- [ ] **Step 2: Run Pint on module PHP files**

```bash
vendor/bin/pint Modules/PageBuilder/
```

- [ ] **Step 3: Run frontend lint**

```bash
npm run lint
npm run types
```

- [ ] **Step 4: Fix any issues found**

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(page-builder): lint fixes and code formatting"
```

- [ ] **Step 6: Run full test suite to verify no regressions**

```bash
php artisan test
```
Expected: All project tests PASS, including existing tests.
