# SP2: Section Template Library Expansion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the section template system from 10 to 44+ templates across all 12 categories, add tagging/search capabilities, and enable admins to create custom templates from existing pages.

**Architecture:** Extends the existing `SectionTemplate` model with a `tags` column (JSON) for filtering. Adds a `SectionTemplateController` for admin CRUD of custom templates. Adds a "Save as Template" feature in the editor that extracts selected components into reusable templates. The `SectionPanel` gets tag-based filtering UI alongside existing category/search.

**Tech Stack:** Laravel 12, Pest 4, React 19, Ant Design, GrapesJS, Inertia v2

---

## File Structure

### New Files

```
Modules/PageBuilder/
├── app/Http/Controllers/Admin/SectionTemplateController.php   # CRUD for custom templates
├── app/Http/Requests/StoreSectionTemplateRequest.php          # Validation for template creation
├── app/Http/Requests/UpdateSectionTemplateRequest.php         # Validation for template update
├── app/Repositories/SectionTemplateRepositoryInterface.php    # Repository interface
├── app/Repositories/SectionTemplateRepository.php             # Repository implementation
├── database/migrations/2026_03_24_000004_add_tags_to_section_templates_table.php
├── database/seeders/Templates/                                # Category-specific template definitions
│   ├── TemplateCategoryInterface.php                          # Interface for category providers
│   ├── HeroTemplates.php                                      # Hero category templates
│   ├── FeatureTemplates.php                                   # Feature category templates
│   ├── PricingTemplates.php                                   # Pricing category templates
│   ├── TestimonialTemplates.php                               # Testimonial category templates
│   ├── CtaTemplates.php                                       # CTA category templates
│   ├── ContentTemplates.php                                   # Content category templates
│   ├── GalleryTemplates.php                                   # Gallery category templates
│   ├── TeamTemplates.php                                      # Team category templates
│   ├── ContactTemplates.php                                   # Contact category templates
│   ├── FooterTemplates.php                                    # Footer category templates
│   ├── HeaderTemplates.php                                    # Header/Nav category templates
│   └── StatsTemplates.php                                     # Stats category templates
├── resources/js/pages/admin/page-builder/templates/
│   └── index.tsx                                              # Template management page
├── resources/js/components/SaveAsTemplateModal.tsx            # Modal for saving editor selection as template
├── tests/Feature/SectionTemplateCrudTest.php                  # CRUD tests for template management
```

### Modified Files

```
Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php  # Refactor to delegate to category files
Modules/PageBuilder/app/Models/SectionTemplate.php              # Add tags cast, scopeByTag
Modules/PageBuilder/app/Services/SectionTemplateService.php     # Add CRUD methods, tag filtering, save-from-editor
Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php # Register new repository binding
Modules/PageBuilder/routes/admin.php                            # Add template management routes
Modules/PageBuilder/resources/js/components/SectionPanel.tsx    # Add tag filter chips
Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx # Add "Save as Template" button
Modules/PageBuilder/resources/js/lib/grapes-blocks.ts           # Add tags to SectionTemplate interface
```

---

## Task 1: Add `tags` Column to `section_templates`

**Files:**
- Create: `Modules/PageBuilder/database/migrations/2026_03_24_000004_add_tags_to_section_templates_table.php`
- Modify: `Modules/PageBuilder/app/Models/SectionTemplate.php`

- [ ] **Step 1: Write the migration**

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
        Schema::table('section_templates', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('category');
            $table->boolean('is_custom')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('section_templates', function (Blueprint $table) {
            $table->dropColumn(['tags', 'is_custom']);
        });
    }
};
```

- [ ] **Step 2: Update `SectionTemplate` model — add `tags` cast, `is_custom` cast, and `scopeByTag`**

Add to `$fillable`: `'tags'`, `'is_custom'`

Add to `casts()`: `'tags' => 'array'`, `'is_custom' => 'boolean'`

Add scopes:

```php
public function scopeByTag(Builder $query, string $tag): Builder
{
    return $query->whereJsonContains('tags', $tag);
}

public function scopeCustom(Builder $query): Builder
{
    return $query->where('is_custom', true);
}

public function scopeBuiltIn(Builder $query): Builder
{
    return $query->where('is_custom', false);
}
```

- [ ] **Step 3: Run migration**

Run: `php artisan migrate`
Expected: Migration completes successfully

- [ ] **Step 4: Commit**

```bash
git add Modules/PageBuilder/database/migrations/2026_03_24_000004_add_tags_to_section_templates_table.php Modules/PageBuilder/app/Models/SectionTemplate.php
git commit -m "feat(page-builder): add tags and is_custom columns to section_templates"
```

---

## Task 2: Create Section Template Repository

**Files:**
- Create: `Modules/PageBuilder/app/Repositories/SectionTemplateRepositoryInterface.php`
- Create: `Modules/PageBuilder/app/Repositories/SectionTemplateRepository.php`
- Modify: `Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php`

- [ ] **Step 1: Create SectionTemplate factory**

Create `Modules/PageBuilder/database/factories/SectionTemplateFactory.php`:

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateFactory extends Factory
{
    protected $model = SectionTemplate::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->unique()->slug(),
            'category' => $this->faker->randomElement(['hero', 'features', 'cta', 'content', 'pricing', 'testimonials']),
            'tags' => $this->faker->randomElements(['dark', 'light', 'minimal', 'bold', 'colorful'], 2),
            'html_template' => '<section>' . $this->faker->sentence() . '</section>',
            'css_template' => '',
            'is_active' => true,
            'is_custom' => false,
            'sort_order' => 0,
        ];
    }
}
```

Add `HasFactory` trait and `newFactory()` method to `SectionTemplate` model:

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;

// In class:
use HasFactory;

protected static function newFactory(): SectionTemplateFactory
{
    return SectionTemplateFactory::new();
}
```

- [ ] **Step 2: Write failing tests for repository**

Create test in `Modules/PageBuilder/tests/Feature/SectionTemplateCrudTest.php`:

```php
<?php

declare(strict_types=1);

use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Repositories\SectionTemplateRepositoryInterface;

describe('SectionTemplateRepository', function () {
    it('creates a custom template', function () {
        $repo = app(SectionTemplateRepositoryInterface::class);

        $template = $repo->create([
            'name' => 'My Custom Hero',
            'slug' => 'my-custom-hero',
            'category' => 'hero',
            'tags' => ['dark', 'minimal'],
            'html_template' => '<section>Custom hero</section>',
            'css_template' => '',
            'is_custom' => true,
        ]);

        expect($template)->toBeInstanceOf(SectionTemplate::class);
        expect($template->name)->toBe('My Custom Hero');
        expect($template->is_custom)->toBeTrue();
        expect($template->tags)->toBe(['dark', 'minimal']);
    });

    it('lists templates filtered by tag', function () {
        SectionTemplate::factory()->create(['tags' => ['dark', 'minimal'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['colorful'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['dark', 'bold'], 'is_active' => true]);

        $repo = app(SectionTemplateRepositoryInterface::class);
        $results = $repo->getByTag('dark');

        expect($results)->toHaveCount(2);
    });

    it('updates a template', function () {
        $template = SectionTemplate::factory()->create(['name' => 'Old Name']);
        $repo = app(SectionTemplateRepositoryInterface::class);

        $updated = $repo->update($template->id, ['name' => 'New Name']);

        expect($updated->name)->toBe('New Name');
    });

    it('deletes a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);
        $repo = app(SectionTemplateRepositoryInterface::class);

        $repo->delete($template->id);

        expect(SectionTemplate::find($template->id))->toBeNull();
    });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `php artisan test --filter=SectionTemplateCrudTest`
Expected: FAIL — `SectionTemplateRepositoryInterface` not found

- [ ] **Step 4: Create repository interface**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

interface SectionTemplateRepositoryInterface
{
    public function create(array $data): SectionTemplate;

    public function update(int $id, array $data): SectionTemplate;

    public function delete(int $id): void;

    public function findById(int $id): ?SectionTemplate;

    public function getByTag(string $tag): Collection;

    public function getCustomTemplates(): Collection;

    public function getAllActive(): Collection;
}
```

- [ ] **Step 5: Create repository implementation**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateRepository implements SectionTemplateRepositoryInterface
{
    public function create(array $data): SectionTemplate
    {
        return SectionTemplate::create($data);
    }

    public function update(int $id, array $data): SectionTemplate
    {
        $template = SectionTemplate::findOrFail($id);
        $template->update($data);

        return $template->fresh();
    }

    public function delete(int $id): void
    {
        SectionTemplate::findOrFail($id)->delete();
    }

    public function findById(int $id): ?SectionTemplate
    {
        return SectionTemplate::find($id);
    }

    public function getByTag(string $tag): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->byTag($tag)
            ->orderBy('sort_order')
            ->get();
    }

    public function getCustomTemplates(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->custom()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();
    }

    public function getAllActive(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->select(['id', 'name', 'slug', 'category', 'thumbnail', 'html_template', 'css_template', 'tags', 'sort_order', 'is_custom'])
            ->orderBy('sort_order')
            ->get();
    }
}
```

- [ ] **Step 6: Bind repository in service provider**

In `PageBuilderServiceProvider::register()`:

```php
$this->app->bind(
    Repositories\SectionTemplateRepositoryInterface::class,
    Repositories\SectionTemplateRepository::class,
);
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `php artisan test --filter=SectionTemplateCrudTest`
Expected: All 4 tests PASS

- [ ] **Step 8: Commit**

```bash
git add Modules/PageBuilder/app/Repositories/SectionTemplateRepositoryInterface.php \
  Modules/PageBuilder/app/Repositories/SectionTemplateRepository.php \
  Modules/PageBuilder/database/factories/SectionTemplateFactory.php \
  Modules/PageBuilder/app/Models/SectionTemplate.php \
  Modules/PageBuilder/app/Providers/PageBuilderServiceProvider.php \
  Modules/PageBuilder/tests/Feature/SectionTemplateCrudTest.php
git commit -m "feat(page-builder): add SectionTemplate repository with CRUD and tag filtering"
```

---

## Task 3: Expand Seeder — Refactor into Category Files (44 Templates)

**Files:**
- Create: `Modules/PageBuilder/database/seeders/Templates/HeroTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/FeatureTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/PricingTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/TestimonialTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/CtaTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/ContentTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/GalleryTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/TeamTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/ContactTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/FooterTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/HeaderTemplates.php`
- Create: `Modules/PageBuilder/database/seeders/Templates/StatsTemplates.php`
- Modify: `Modules/PageBuilder/database/seeders/SectionTemplateSeeder.php`

> **Note:** This task is large because it contains 12 template files with HTML/CSS content. Each category file is independent and can be written in parallel by subagents. The main seeder refactor should be done first, then category files can be dispatched in batches.

### Sub-task 3a: Refactor main seeder to delegate

- [ ] **Step 1: Create the category template trait/interface pattern**

Create a base interface that all category files implement:

```php
// Modules/PageBuilder/database/seeders/Templates/TemplateCategoryInterface.php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

interface TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array;
}
```

- [ ] **Step 2: Refactor `SectionTemplateSeeder` to collect from category files**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\PageBuilder\Database\Seeders\Templates\ContactTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\ContentTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\CtaTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\FeatureTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\FooterTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\GalleryTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\HeaderTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\HeroTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\PricingTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\StatsTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\TeamTemplates;
use Modules\PageBuilder\Database\Seeders\Templates\TestimonialTemplates;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateSeeder extends Seeder
{
    /** @var list<class-string<SectionTemplateSeeder\TemplateCategoryInterface>> */
    private const CATEGORIES = [
        HeroTemplates::class,
        FeatureTemplates::class,
        PricingTemplates::class,
        TestimonialTemplates::class,
        CtaTemplates::class,
        ContentTemplates::class,
        GalleryTemplates::class,
        TeamTemplates::class,
        ContactTemplates::class,
        FooterTemplates::class,
        HeaderTemplates::class,
        StatsTemplates::class,
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $categoryClass) {
            foreach ($categoryClass::templates() as $template) {
                SectionTemplate::updateOrCreate(
                    ['slug' => $template['slug']],
                    $template,
                );
            }
        }
    }
}
```

- [ ] **Step 3: Commit seeder refactor**

```bash
git add Modules/PageBuilder/database/seeders/
git commit -m "refactor(page-builder): split seeder into category files with interface"
```

### Sub-task 3b: Hero Templates (5 total — 3 existing + 2 new)

- [ ] **Step 1: Create `HeroTemplates.php`**

Move existing 3 hero templates from old seeder + add 2 new:
- `video-background-hero`: Dark overlay hero with video placeholder background
- `gradient-overlay-hero`: Image hero with gradient overlay and centered CTA

Each template includes `tags` array (e.g., `['dark', 'fullscreen']`, `['gradient', 'centered']`).

All templates must follow existing patterns:
- Use CSS custom properties: `--section-bg`, `--section-text`, `--section-accent`, `--section-spacing`
- Include responsive `@media` queries in `css_template`
- Use `pb-` prefixed class names for CSS scoping
- Set `sort_order` sequentially within category

- [ ] **Step 2: Run seeder and verify**

Run: `php artisan db:seed --class='Modules\PageBuilder\Database\Seeders\SectionTemplateSeeder'`
Expected: 5 hero templates in DB

### Sub-task 3c: Feature Templates (4 total — 3 existing + 1 new)

- [ ] **Step 1: Create `FeatureTemplates.php`**

Move existing 3 + add 1 new:
- `numbered-list-features`: Numbered feature list with descriptions

Tags: `['numbered', 'list', 'minimal']`

### Sub-task 3d: Pricing Templates (4 new)

- [ ] **Step 1: Create `PricingTemplates.php`**

New templates:
- `pricing-two-tier`: 2-column pricing cards with CTA buttons. Tags: `['simple', 'cards']`
- `pricing-three-tier`: 3-column pricing with highlighted "Popular" tier. Tags: `['popular', 'cards', 'highlight']`
- `pricing-comparison-table`: Full comparison table with checkmarks. Tags: `['table', 'detailed']`
- `pricing-single-highlight`: Single featured plan with details. Tags: `['single', 'minimal', 'focused']`

### Sub-task 3e: Testimonial Templates (4 new)

- [ ] **Step 1: Create `TestimonialTemplates.php`**

New templates:
- `testimonial-carousel`: Single testimonial with navigation dots. Tags: `['carousel', 'interactive']`
- `testimonial-three-card`: 3-card grid with avatars and quotes. Tags: `['grid', 'cards', 'avatar']`
- `testimonial-single-quote`: Large centered quote with attribution. Tags: `['single', 'minimal', 'centered']`
- `testimonial-logo-wall`: Client logos grid with optional quotes. Tags: `['logos', 'trust', 'social-proof']`

### Sub-task 3f: CTA Templates (2 new — 2 existing)

- [ ] **Step 1: Create `CtaTemplates.php`**

Move existing 2 + add 2 new:
- `minimal-cta`: Simple text + single button, white background. Tags: `['minimal', 'clean']`
- `floating-cta`: Card-style CTA with shadow, offset from background. Tags: `['card', 'shadow', 'floating']`

### Sub-task 3g: Content Templates (2 new — 2 existing)

- [ ] **Step 1: Create `ContentTemplates.php`**

Move existing 2 + add 2 new:
- `two-column-content`: Two equal columns of text content. Tags: `['columns', 'text']`
- `accordion-faq`: Expandable FAQ accordion items. Tags: `['faq', 'accordion', 'interactive']`

### Sub-task 3h: Gallery Templates (4 new)

- [ ] **Step 1: Create `GalleryTemplates.php`**

New templates:
- `gallery-masonry-grid`: Masonry-style image grid layout. Tags: `['masonry', 'images', 'grid']`
- `gallery-lightbox-grid`: Even grid with lightbox-ready images. Tags: `['lightbox', 'images', 'grid']`
- `gallery-slider`: Horizontal image slider with navigation. Tags: `['slider', 'carousel', 'images']`
- `gallery-before-after`: Before/after comparison with slider. Tags: `['comparison', 'interactive']`

### Sub-task 3i: Team Templates (3 new)

- [ ] **Step 1: Create `TeamTemplates.php`**

New templates:
- `team-card-grid`: Card grid with photos, names, roles, social links. Tags: `['cards', 'grid', 'social']`
- `team-list-bio`: List layout with photo, name, role, bio paragraph. Tags: `['list', 'detailed', 'bio']`
- `team-minimal-avatars`: Compact avatar row with names and roles. Tags: `['minimal', 'avatars', 'compact']`

### Sub-task 3j: Contact Templates (3 new)

- [ ] **Step 1: Create `ContactTemplates.php`**

New templates:
- `contact-form-map`: Split layout with form + embedded map placeholder. Tags: `['form', 'map', 'split']`
- `contact-simple-form`: Centered contact form. Tags: `['form', 'simple', 'centered']`
- `contact-info-cards`: Contact info cards (email, phone, address). Tags: `['cards', 'info', 'minimal']`

### Sub-task 3k: Footer Templates (3 new)

- [ ] **Step 1: Create `FooterTemplates.php`**

New templates:
- `footer-multi-column`: 4-column footer with links, about, newsletter. Tags: `['links', 'newsletter', 'comprehensive']`
- `footer-minimal`: Single line footer with copyright + links. Tags: `['minimal', 'simple']`
- `footer-social-focused`: Centered footer with large social icons. Tags: `['social', 'centered', 'icons']`

### Sub-task 3l: Header Templates (3 new)

- [ ] **Step 1: Create `HeaderTemplates.php`**

New templates:
- `header-sticky-nav`: Fixed top nav with logo, links, CTA button. Tags: `['sticky', 'fixed', 'cta']`
- `header-centered-logo`: Centered logo with navigation below. Tags: `['centered', 'logo', 'classic']`
- `header-hamburger-mobile`: Nav with hamburger icon placeholder for mobile. Tags: `['hamburger', 'mobile', 'responsive']`

### Sub-task 3m: Stats Templates (3 new)

- [ ] **Step 1: Create `StatsTemplates.php`**

New templates:
- `stats-counter-row`: Horizontal row of stat numbers with labels. Tags: `['counters', 'numbers', 'row']`
- `stats-progress-bars`: Vertical list of skills/metrics with progress bars. Tags: `['progress', 'bars', 'skills']`
- `stats-icon-number-grid`: Grid of icon + number + label cards. Tags: `['grid', 'icons', 'cards']`

### Sub-task 3n: Verify all 44 templates seed correctly

- [ ] **Step 1: Run full seeder**

Run: `php artisan db:seed --class='Modules\PageBuilder\Database\Seeders\SectionTemplateSeeder'`

- [ ] **Step 2: Verify counts**

Run: `php artisan tinker --execute="echo Modules\PageBuilder\Models\SectionTemplate::count();"`
Expected: `44`

Run: `php artisan tinker --execute="Modules\PageBuilder\Models\SectionTemplate::select('category', \Illuminate\Support\Facades\DB::raw('count(*) as cnt'))->groupBy('category')->pluck('cnt','category')->toJson();"`
Expected: hero:5, features:4, pricing:4, testimonials:4, cta:4, content:4, gallery:4, team:3, contact:3, footer:3, header:3, stats:3

- [ ] **Step 3: Run existing seeder tests**

Run: `php artisan test --filter=SectionTemplateTest`
Expected: All tests PASS (existing tests should still work since they check `>=3` heroes)

- [ ] **Step 4: Commit**

```bash
git add Modules/PageBuilder/database/seeders/
git commit -m "feat(page-builder): expand section templates to 44 across 12 categories"
```

---

## Task 4: Update SectionTemplateService with Tag Filtering

**Files:**
- Modify: `Modules/PageBuilder/app/Services/SectionTemplateService.php`

- [ ] **Step 1: Write failing tests**

Add to `SectionTemplateCrudTest.php`:

```php
describe('SectionTemplateService', function () {
    it('returns all unique tags from active templates', function () {
        SectionTemplate::factory()->create(['tags' => ['dark', 'minimal'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['dark', 'bold'], 'is_active' => true]);
        SectionTemplate::factory()->create(['tags' => ['colorful'], 'is_active' => true]);

        $service = app(SectionTemplateService::class);
        $tags = $service->getAllTags();

        expect($tags)->toContain('dark', 'minimal', 'bold', 'colorful');
        expect(count($tags))->toBe(4);
    });

    it('groups templates by category with tag filtering', function () {
        SectionTemplate::factory()->create(['category' => 'hero', 'tags' => ['dark'], 'is_active' => true]);
        SectionTemplate::factory()->create(['category' => 'hero', 'tags' => ['light'], 'is_active' => true]);
        SectionTemplate::factory()->create(['category' => 'cta', 'tags' => ['dark'], 'is_active' => true]);

        $service = app(SectionTemplateService::class);
        $grouped = $service->getGroupedByCategory(tag: 'dark');

        expect($grouped)->toHaveKey('hero');
        expect($grouped)->toHaveKey('cta');
        expect($grouped['hero'])->toHaveCount(1);
    });

    it('creates custom template from editor data', function () {
        $service = app(SectionTemplateService::class);

        $template = $service->createFromEditor(
            name: 'My Custom Section',
            category: 'hero',
            htmlTemplate: '<section>Custom</section>',
            cssTemplate: '.custom { color: red; }',
            tags: ['custom', 'dark'],
        );

        expect($template->is_custom)->toBeTrue();
        expect($template->slug)->toStartWith('my-custom-section');
        expect($template->tags)->toBe(['custom', 'dark']);
    });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `php artisan test --filter=SectionTemplateService`
Expected: FAIL

- [ ] **Step 3: Update SectionTemplateService**

Add new methods to `SectionTemplateService`:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Modules\PageBuilder\Repositories\SectionTemplateRepositoryInterface;

// Add constructor injection:
public function __construct(
    private readonly SectionTemplateRepositoryInterface $repository,
) {}

/** @return list<string> */
public function getAllTags(): array
{
    return $this->repository->getAllActive()
        ->pluck('tags')
        ->flatten()
        ->filter()
        ->unique()
        ->sort()
        ->values()
        ->all();
}

/**
 * Uses a single cache key for all templates, then filters in-memory.
 * With ~44 templates, in-memory filtering is simpler and avoids
 * cache invalidation complexity with tag-specific keys.
 *
 * @return array<string, mixed>
 */
public function getGroupedByCategory(?string $tag = null): array
{
    $all = Cache::remember('section_templates.grouped', 3600, function () {
        return $this->repository->getAllActive();
    });

    if ($tag) {
        $all = $all->filter(fn (SectionTemplate $t) => in_array($tag, $t->tags ?? [], true));
    }

    return $all->groupBy('category')->toArray();
}

public function createFromEditor(
    string $name,
    string $category,
    string $htmlTemplate,
    string $cssTemplate = '',
    array $tags = [],
): SectionTemplate {
    $this->clearCache();

    $slug = Str::slug($name);
    if (SectionTemplate::where('slug', $slug)->exists()) {
        $slug .= '-' . Str::random(4);
    }

    return $this->repository->create([
        'name' => $name,
        'slug' => $slug,
        'category' => $category,
        'html_template' => $htmlTemplate,
        'css_template' => $cssTemplate,
        'tags' => $tags,
        'is_custom' => true,
        'is_active' => true,
        'sort_order' => 0,
    ]);
}

public function updateTemplate(int $id, array $data): SectionTemplate
{
    $this->clearCache();

    return $this->repository->update($id, $data);
}

public function deleteTemplate(int $id): void
{
    $this->clearCache();
    $this->repository->delete($id);
}

private function clearCache(): void
{
    Cache::forget('section_templates.grouped');
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `php artisan test --filter=SectionTemplateService`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add Modules/PageBuilder/app/Services/SectionTemplateService.php Modules/PageBuilder/tests/Feature/SectionTemplateCrudTest.php
git commit -m "feat(page-builder): add tag filtering and createFromEditor to SectionTemplateService"
```

---

## Task 5: Section Template Admin CRUD Controller

**Files:**
- Create: `Modules/PageBuilder/app/Http/Controllers/Admin/SectionTemplateController.php`
- Create: `Modules/PageBuilder/app/Http/Requests/StoreSectionTemplateRequest.php`
- Create: `Modules/PageBuilder/app/Http/Requests/UpdateSectionTemplateRequest.php`
- Modify: `Modules/PageBuilder/routes/admin.php`

- [ ] **Step 1: Write failing feature tests**

Create `Modules/PageBuilder/tests/Feature/SectionTemplateAdminTest.php`:

```php
<?php

declare(strict_types=1);

use App\Models\User;
use Modules\PageBuilder\Models\SectionTemplate;

describe('Section Template Admin', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create();
        // Assign admin role/permission as needed by your auth setup
    });

    it('lists all section templates', function () {
        SectionTemplate::factory()->count(3)->create();

        $this->actingAs($this->admin)
            ->get('/admin/page-builder/templates')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('PageBuilder::admin/page-builder/templates/index')
                ->has('templates.data', 3)
            );
    });

    it('creates a custom template', function () {
        $this->actingAs($this->admin)
            ->post('/admin/page-builder/templates', [
                'name' => 'My Template',
                'category' => 'hero',
                'html_template' => '<section>Hello</section>',
                'css_template' => '',
                'tags' => ['dark'],
            ])
            ->assertCreated();

        $this->assertDatabaseHas('section_templates', [
            'name' => 'My Template',
            'is_custom' => true,
        ]);
    });

    it('updates a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);

        $this->actingAs($this->admin)
            ->put("/admin/page-builder/templates/{$template->id}", [
                'name' => 'Updated Name',
                'category' => $template->category,
                'html_template' => $template->html_template,
                'tags' => ['updated'],
            ])
            ->assertOk();

        expect($template->fresh()->name)->toBe('Updated Name');
    });

    it('deletes a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);

        $this->actingAs($this->admin)
            ->delete("/admin/page-builder/templates/{$template->id}")
            ->assertOk();

        expect(SectionTemplate::find($template->id))->toBeNull();
    });

    it('prevents deletion of built-in templates', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => false]);

        $this->actingAs($this->admin)
            ->delete("/admin/page-builder/templates/{$template->id}")
            ->assertForbidden();
    });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `php artisan test --filter=SectionTemplateAdminTest`
Expected: FAIL — route not found

- [ ] **Step 3: Create StoreSectionTemplateRequest**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSectionTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:50'],
            'html_template' => ['required', 'string'],
            'css_template' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
```

- [ ] **Step 4: Create UpdateSectionTemplateRequest**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:50'],
            'html_template' => ['sometimes', 'required', 'string'],
            'css_template' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
```

- [ ] **Step 5: Create SectionTemplateController**

```php
<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PageBuilder\Http\Requests\StoreSectionTemplateRequest;
use Modules\PageBuilder\Http\Requests\UpdateSectionTemplateRequest;
use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Services\SectionTemplateService;

class SectionTemplateController extends Controller
{
    public function __construct(
        private readonly SectionTemplateService $service,
    ) {}

    public function index(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/templates/index', [
            'templates' => fn () => SectionTemplate::query()
                ->orderBy('category')
                ->orderBy('sort_order')
                ->paginate(20),
            'tags' => fn () => $this->service->getAllTags(),
            'categories' => fn () => SectionTemplate::query()
                ->select('category')
                ->distinct()
                ->pluck('category'),
        ]);
    }

    public function store(StoreSectionTemplateRequest $request): JsonResponse
    {
        $template = $this->service->createFromEditor(
            name: $request->validated('name'),
            category: $request->validated('category'),
            htmlTemplate: $request->validated('html_template'),
            cssTemplate: $request->validated('css_template', ''),
            tags: $request->validated('tags', []),
        );

        return response()->json([
            'message' => 'Template created',
            'data' => $template,
        ], 201);
    }

    public function update(UpdateSectionTemplateRequest $request, SectionTemplate $template): JsonResponse
    {
        $updated = $this->service->updateTemplate($template->id, $request->validated());

        return response()->json([
            'message' => 'Template updated',
            'data' => $updated,
        ]);
    }

    public function destroy(SectionTemplate $template): JsonResponse
    {
        if (! $template->is_custom) {
            return response()->json(['message' => 'Cannot delete built-in templates'], 403);
        }

        $this->service->deleteTemplate($template->id);

        return response()->json(['message' => 'Template deleted']);
    }
}
```

- [ ] **Step 6: Add routes**

Add to `Modules/PageBuilder/routes/admin.php`:

```php
use Modules\PageBuilder\Http\Controllers\Admin\SectionTemplateController;

// Inside the existing route group:
Route::get('/templates', [SectionTemplateController::class, 'index'])->name('templates.index');
Route::post('/templates', [SectionTemplateController::class, 'store'])->name('templates.store');
Route::put('/templates/{template}', [SectionTemplateController::class, 'update'])->name('templates.update');
Route::delete('/templates/{template}', [SectionTemplateController::class, 'destroy'])->name('templates.destroy');
```

- [ ] **Step 7: Run tests to verify pass**

Run: `php artisan test --filter=SectionTemplateAdminTest`
Expected: All 5 tests PASS

- [ ] **Step 8: Commit**

```bash
git add Modules/PageBuilder/app/Http/Controllers/Admin/SectionTemplateController.php \
  Modules/PageBuilder/app/Http/Requests/StoreSectionTemplateRequest.php \
  Modules/PageBuilder/app/Http/Requests/UpdateSectionTemplateRequest.php \
  Modules/PageBuilder/routes/admin.php \
  Modules/PageBuilder/tests/Feature/SectionTemplateAdminTest.php
git commit -m "feat(page-builder): add section template admin CRUD with built-in protection"
```

---

## Task 6: Template Management UI (Index Page)

**Files:**
- Create: `Modules/PageBuilder/resources/js/pages/admin/page-builder/templates/index.tsx`

- [ ] **Step 1: Create template management page**

Build a DataTable-based page showing all templates with:
- Columns: Name, Category (tag), Tags (tag chips), Type (built-in/custom badge), Status (active/inactive)
- Filter by category (dropdown) and tag (multi-select)
- Search by name
- "Create Template" button for custom templates
- Row click navigates to edit page for custom templates
- `persistenceKey: 'page-builder-templates'`

Follow existing CRUD patterns from the codebase:
- Clickable rows with `cursor-pointer` and `hover:bg-gray-50`
- Use Ant Design Tag components for categories and tags
- Use the project's DataTable component

Props interface:

```tsx
interface Props {
    templates: PaginatedData<SectionTemplateItem>;
    tags: string[];
    categories: string[];
}

interface SectionTemplateItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    tags: string[] | null;
    is_active: boolean;
    is_custom: boolean;
    sort_order: number;
    created_at: string;
}
```

- [ ] **Step 2: Verify page renders**

Run: `npm run dev` and navigate to `/admin/page-builder/templates`
Expected: Page renders with template list

- [ ] **Step 3: Commit**

```bash
git add Modules/PageBuilder/resources/js/pages/admin/page-builder/templates/index.tsx
git commit -m "feat(page-builder): add template management index page with filtering"
```

---

## Task 7: Tag Filter UI in Section Panel

**Files:**
- Modify: `Modules/PageBuilder/resources/js/components/SectionPanel.tsx`
- Modify: `Modules/PageBuilder/resources/js/lib/grapes-blocks.ts`
- Modify: `Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php`

- [ ] **Step 1: Update SectionTemplate interface to include tags**

In `grapes-blocks.ts`, add to the `SectionTemplate` interface:

```typescript
export interface SectionTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    tags: string[] | null;   // NEW
    is_custom: boolean;      // NEW
    html_template: string;
    css_template: string | null;
    thumbnail: string | null;
}
```

- [ ] **Step 2: Update SectionPanel with tag filter chips**

Add a horizontal scrollable row of tag chips below the search input. Clicking a tag filters templates to only show those containing that tag. Multiple tags can be selected (AND logic). A "clear" button resets tag filters.

```tsx
// Add to SectionPanel state:
const [selectedTags, setSelectedTags] = useState<string[]>([]);

// Derive unique tags from all templates (React Compiler handles memoization):
const allTagSet = new Set<string>();
Object.values(templates).forEach(sections =>
    sections.forEach(s => s.tags?.forEach(t => allTagSet.add(t)))
);
const allTags = Array.from(allTagSet).sort();

// Update filtering to also filter by selected tags:
const filtered = sections.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => s.tags?.includes(tag));
    return matchesSearch && matchesTags;
});
```

Add tag chips UI between search and collapse:

```tsx
{allTags.length > 0 && (
    <div style={{ padding: '4px 8px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {selectedTags.length > 0 && (
            <Tag closable onClose={() => setSelectedTags([])}>Clear</Tag>
        )}
        {allTags.map(tag => (
            <Tag
                key={tag}
                color={selectedTags.includes(tag) ? 'blue' : undefined}
                onClick={() => toggleTag(tag)}
                style={{ cursor: 'pointer', fontSize: 11 }}
            >
                {tag}
            </Tag>
        ))}
    </div>
)}
```

- [ ] **Step 3: Update controller to pass tags in template data**

In `PageBuilderController::editor()`, the `getGroupedByCategory()` already returns `tags` from the updated `select()` in Task 4. Verify the select list includes `'tags'` and `'is_custom'`.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev` and open the editor page
Expected: Tag chips appear below search, clicking filters templates

- [ ] **Step 5: Commit**

```bash
git add Modules/PageBuilder/resources/js/components/SectionPanel.tsx \
  Modules/PageBuilder/resources/js/lib/grapes-blocks.ts \
  Modules/PageBuilder/app/Http/Controllers/Admin/PageBuilderController.php
git commit -m "feat(page-builder): add tag-based filtering to section panel"
```

---

## Task 8: Save as Template Feature (Editor → Custom Template)

**Files:**
- Create: `Modules/PageBuilder/resources/js/components/SaveAsTemplateModal.tsx`
- Modify: `Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx`

> **Note:** Backend endpoint already exists from Task 5 (`POST /admin/page-builder/templates`). This task is frontend-only.

- [ ] **Step 1: Create SaveAsTemplateModal component**

An Ant Design Modal with:
- `name` input (required)
- `category` select (dropdown with existing categories)
- `tags` select (mode="tags" for free-form tag entry)
- Save button that POSTs to `/admin/page-builder/templates`

The modal receives `html` and `css` props from the editor's selected component (or full page if nothing selected).

```tsx
interface SaveAsTemplateModalProps {
    open: boolean;
    onClose: () => void;
    html: string;
    css: string;
    categories: string[];
}
```

- [ ] **Step 4: Add "Save as Template" button to editor toolbar**

In `editor.tsx`, add a button to the toolbar that:
1. Gets the selected component's HTML via `editor.getSelected()?.toHTML()` or full page HTML
2. Gets CSS from `editor.getCss()`
3. Opens the `SaveAsTemplateModal`
4. On success, shows a success message and optionally reloads templates

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`, open editor, select a component, click "Save as Template"
Expected: Modal opens, form submits, template appears in section panel after reload

- [ ] **Step 6: Commit**

```bash
git add Modules/PageBuilder/resources/js/components/SaveAsTemplateModal.tsx \
  Modules/PageBuilder/resources/js/pages/admin/page-builder/editor.tsx
git commit -m "feat(page-builder): add save-as-template from editor with modal UI"
```

---

## Task 9: Final Verification & Cleanup

**Files:**
- All modified files

- [ ] **Step 1: Run full test suite**

Run: `php artisan test --filter=PageBuilder`
Expected: All tests PASS

- [ ] **Step 2: Run Pint**

Run: `vendor/bin/pint --dirty`
Expected: All files formatted

- [ ] **Step 3: Run frontend checks**

Run: `npm run lint && npm run types`
Expected: No errors

- [ ] **Step 4: Run seeder from scratch**

Run: `php artisan migrate:fresh --seed`
Then: `php artisan db:seed --class='Modules\PageBuilder\Database\Seeders\SectionTemplateSeeder'`
Expected: 44 templates seeded

- [ ] **Step 5: Verify editor loads with all templates**

Open editor page and verify all 12 categories appear in the section panel with correct template counts.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore(page-builder): SP2 cleanup and verification"
```
