# AI Page Builder Module — Design Spec

## Overview

A GrapesJS-powered visual page builder module for the Liar admin panel. Ships as an optional `nwidart/laravel-modules` module — when enabled, admins can create pages using a drag-and-drop canvas editor alongside the existing TipTap editor. Pages built with the builder compile to static HTML for fast, SEO-friendly public rendering.

This spec covers **Sub-project 1: Core Builder Engine**. Sub-projects 2-4 are documented in the roadmap section.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Target user | Site admins/editors | Admin-panel tool, not multi-tenant SaaS |
| Editor coexistence | TipTap + Builder side-by-side | Admins choose per-page; no breaking changes |
| AI capabilities (future) | Full suite: page gen, section gen, content rewrite, style suggestions, image gen | Sub-project 3 |
| Section templates | Shipped with module | Self-contained, no remote marketplace |
| Editor paradigm | Drag-and-drop canvas (Elementor/Wix style) | Full spatial control |
| Responsive approach | Smart defaults + manual breakpoint override | Balance of ease and control |
| Public rendering | Server-rendered static HTML at publish time | Fast, SEO-friendly, no JS runtime |
| Design customization | Constrained presets (not full CSS) | Keeps pages on-brand |
| Brand context for AI | Manual brand profile | Clear source of truth |
| Builder engine | GrapesJS | Most built-in features, native HTML+CSS output, 20k stars, rich plugin ecosystem |

## Module Structure

```
Modules/PageBuilder/
├── module.json
├── app/
│   ├── Providers/
│   │   ├── PageBuilderServiceProvider.php    # Registers contracts (HasPermissions, HasAdminNavigation)
│   │   └── RouteServiceProvider.php
│   ├── Http/
│   │   ├── Controllers/Admin/
│   │   │   └── PageBuilderController.php     # CRUD for builder pages
│   │   └── Requests/
│   │       ├── StorePageRequest.php
│   │       └── UpdatePageRequest.php
│   ├── Services/
│   │   ├── PageBuilderService.php            # Business logic
│   │   ├── PageCompilerService.php           # GrapesJS JSON → static HTML
│   │   └── SectionTemplateService.php        # Manages pre-built sections
│   ├── Repositories/
│   │   ├── BuilderPageRepositoryInterface.php
│   │   └── BuilderPageRepository.php
│   └── Models/
│       ├── BuilderPage.php                   # Stores GrapesJS data
│       └── BrandProfile.php                  # Brand settings for AI
├── config/
│   └── page-builder.php
├── database/
│   ├── migrations/
│   │   ├── create_builder_pages_table.php
│   │   ├── create_brand_profiles_table.php
│   │   └── create_section_templates_table.php
│   └── seeders/
│       └── SectionTemplateSeeder.php         # Seeds ~44 pre-built sections
├── resources/
│   ├── js/
│   │   ├── app.tsx                           # Module entry point
│   │   ├── pages/admin/page-builder/
│   │   │   ├── index.tsx                     # List builder pages (DataTable)
│   │   │   ├── create.tsx                    # New page — choose TipTap or Builder
│   │   │   └── editor.tsx                    # GrapesJS editor page
│   │   ├── components/
│   │   │   ├── GrapesEditor.tsx              # React wrapper for GrapesJS
│   │   │   ├── SectionPanel.tsx              # Pre-built section browser
│   │   │   ├── StylePresets.tsx              # Constrained style options
│   │   │   └── PagePreview.tsx               # Live preview
│   │   └── lib/
│   │       ├── grapes-config.ts              # GrapesJS configuration
│   │       ├── grapes-blocks.ts              # Section block definitions
│   │       └── grapes-plugins.ts             # Custom plugins (style presets, asset manager)
│   └── views/
│       └── compiled/                         # Blade layout for compiled pages
├── routes/
│   └── admin.php
└── tests/
```

### Integration Points

- `PageBuilderServiceProvider` implements `HasPermissions` and `HasAdminNavigation` contracts
- When enabled, "Page Builder" appears in admin sidebar
- Existing `Post` model with `type: page` remains untouched
- Module entry point loaded by Vite via `modules_statuses.json`
- `resolveModulePage()` handles `PageBuilder::path/to/page` resolution

## Data Model

### `posts` table (existing — new column)

| Column | Type | Purpose |
|--------|------|---------|
| `editor_mode` | enum(`tiptap`, `builder`) default `tiptap` | Determines which editor loads for pages |

This column is added via a module migration. Defaults to `tiptap` so all existing pages are unaffected. The column lives on `posts` (not `builder_pages`) because it needs to be checked before loading the editor, regardless of whether a `builder_pages` row exists yet (e.g., when creating a new page).

### `builder_pages`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | bigint PK | |
| `post_id` | FK → posts (unique) | Links to existing Post model (type: page) |
| `grapes_data` | JSON | GrapesJS component tree (editor state) |
| `grapes_css` | longText | GrapesJS generated CSS |
| `compiled_html` | longText | Final static HTML output (generated at publish) |
| `compiled_css` | longText | Final static CSS output (generated at publish) |
| `compiled_at` | timestamp | When last compiled |

**Relationships:**
- `BuilderPage belongsTo Post`
- `Post hasOne BuilderPage`
- `editor_mode` on `posts` determines the editor; `builder_pages` row stores the builder data
- A page with `editor_mode = builder` but no `builder_pages` row is a new builder page (row created on first save)

### `brand_profiles` (deferred to SP3)

Schema documented here for reference. Table, model, and UI are implemented in Sub-project 3 (AI Integration).

| Column | Type | Purpose |
|--------|------|---------|
| `id` | bigint PK | |
| `business_name` | string | |
| `industry` | string | |
| `tone_of_voice` | string | e.g. "professional", "casual", "playful" |
| `target_audience` | text | |
| `color_palette` | JSON | Primary, secondary, accent colors |
| `font_preferences` | JSON | Heading/body font choices |
| `brand_description` | text | Free-form brand identity |

### `section_templates`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | bigint PK | |
| `name` | string | e.g. "Hero with CTA" |
| `slug` | string unique | |
| `category` | string | hero, features, pricing, testimonials, cta, footer, etc. |
| `thumbnail` | string | Path to preview image |
| `grapes_data` | JSON | GrapesJS block definition |
| `html_template` | longText | Base HTML |
| `css_template` | longText | Base CSS |
| `is_active` | boolean | |
| `sort_order` | int | |

## GrapesJS Editor Architecture

### Editor Layout

```
┌─────────────────────────────────────────────────────────┐
│  Toolbar: Save | Preview | Undo/Redo | Device Toggle    │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│ Section  │                              │  Style        │
│ Panel    │      GrapesJS Canvas         │  Presets      │
│          │                              │  Panel        │
│ (drag    │   (drag-and-drop editing)    │  (constrained │
│  sections│                              │   options)    │
│  onto    │                              │               │
│  canvas) │                              │               │
│          │                              │               │
├──────────┴──────────────────────────────┴───────────────┤
│  Layer Panel (collapsible bottom)                       │
└─────────────────────────────────────────────────────────┘
```

### React ↔ GrapesJS Bridge

- `GrapesEditor.tsx` wraps GrapesJS using `useRef` + `useEffect` for lifecycle
- GrapesJS initializes in a container div
- React controls surrounding UI (toolbar, section panel, save button)
- Thin custom wrapper preferred over `grapesjs-react` for more control

### Block System

- Each `section_template` registers as a GrapesJS block on editor load
- `SectionTemplateService` fetches active templates, passes to frontend
- Blocks contain pre-built HTML+CSS, fully editable once placed on canvas
- Templates use CSS custom properties (`--section-bg`, `--text-color`, `--spacing`) so presets can restyle them

### Style Presets (Custom GrapesJS Plugin)

Replaces GrapesJS's default Style Manager with constrained options:
- Color theme picker (from brand palette)
- Font size presets (S / M / L / XL)
- Spacing presets (compact / normal / spacious)
- Background options (solid color, gradient, image)
- Border radius presets

### Storage Flow

- Auto-save every 30 seconds → `PUT /admin/page-builder/{id}` → saves `grapes_data` + `grapes_css`
- Manual save via toolbar button
- "Publish" compiles HTML+CSS via `PageCompilerService` and updates Post status to `published`

### Device Preview

- GrapesJS built-in device manager with 3 breakpoints:
  - Desktop: 1200px
  - Tablet: 768px
  - Mobile: 375px
- Admins switch views and tweak per breakpoint

### Asset Management

- GrapesJS Asset Manager configured to upload via Spatie MediaLibrary
- Images upload to a `page-builder` media collection
- Reuses existing media infrastructure

## Page Compilation & Public Rendering

### Compilation Pipeline

```
GrapesJS Editor State
        │
        ▼
┌─────────────────────┐
│ PageCompilerService  │
│                      │
│ 1. Extract HTML from │
│    grapes_data       │
│ 2. Extract CSS from  │
│    grapes_css        │
│ 3. Inline critical   │
│    CSS               │
│ 4. Purge unused CSS  │
│ 5. Minify HTML+CSS   │
│ 6. Sanitize (XSS     │
│    via HTMLPurifier)  │
│ 7. Store compiled    │
│    output            │
└─────────────────────┘
        │
        ▼
  builder_pages.compiled_html
  builder_pages.compiled_css
```

### Public Route Handler

**The PageBuilder module only owns rendering of builder pages.** It does not take over routing for TipTap pages or any other content. If the module is disabled, builder pages return 404 — all other pages are unaffected.

**Route registration:** The module registers a public route in its own `routes/web.php` (loaded by its `RouteServiceProvider`):

```
GET /p/{slug}                          # Module-scoped prefix to avoid conflicts
  1. Find published Post by slug where editor_mode = 'builder'
  2. If not found → 404
  3. Load BuilderPage → render compiled HTML in Blade layout
     - Blade layout adds <head> (meta tags, OG tags, favicon)
     - Optional header/footer (configurable per page)
     - Injects compiled CSS
     - No React, no Inertia, no JS runtime
```

The `/p/{slug}` prefix avoids route conflicts with existing routes (`/dashboard`, `/login`, etc.). If a vanity URL is needed (e.g., `/pricing` instead of `/p/pricing`), an optional redirect or catch-all route can be added later as an enhancement — but the base implementation uses the prefix for safety.

**TipTap pages** continue to render through their existing mechanism (or a future public page system) — the PageBuilder module does not interfere with them.

### Security

- HTMLPurifier sanitizes compiled output before storing
- Defense-in-depth even though admins control content

### Caching

- Compiled HTML stored in DB, only recompiled on publish
- Optional file cache or CDN integration for zero-DB serving

## Section Template Library

### Initial Set (~44 sections)

| Category | Sections | Count |
|----------|----------|-------|
| Hero | Full-width image, split (text+image), video background, centered text, gradient overlay | 5 |
| Features | Icon grid (3/4 col), alternating rows, feature cards, numbered list | 4 |
| Pricing | 2-tier, 3-tier, comparison table, single highlight | 4 |
| Testimonials | Carousel, 3-card grid, single quote, logo wall | 4 |
| CTA | Banner, split, minimal, floating | 4 |
| Content | Text block, text+image, two-column, accordion/FAQ | 4 |
| Gallery | Masonry grid, lightbox grid, slider, before/after | 4 |
| Team | Card grid, list with bio, minimal avatars | 3 |
| Contact | Form + map, simple form, contact info cards | 3 |
| Footer | Multi-column links, minimal, social-focused | 3 |
| Header/Nav | Sticky nav, centered logo, hamburger mobile | 3 |
| Stats | Counter row, progress bars, icon+number grid | 3 |

### Template Storage

- Templates are stored as structured arrays in `SectionTemplateSeeder` (HTML+CSS strings in PHP)
- No external template files — everything self-contained in the seeder class
- Each template entry includes: name, slug, category, html_template, css_template, sort_order
- Thumbnails generated as simple SVG placeholders initially; real previews can be added later

### Template Design

- All sections responsive by default
- Use CSS custom properties for preset-driven restyling
- Seeded via `SectionTemplateSeeder` during module installation

## Sub-Project Roadmap

### SP1: Core Builder Engine ✅
The GrapesJS-based editor, data model, compilation pipeline, section templates, and public rendering.

### SP2: Section Template Library Expansion ✅ (foundation)
**Completed:**
- ✅ Expanded from 10 to 44 sections across all 12 categories (hero, features, pricing, testimonials, CTA, content, gallery, team, contact, footer, header, stats)
- ✅ Template tagging (JSON tags column) and tag-based filtering in editor panel
- ✅ Save as Template — create custom templates from editor selections
- ✅ Admin template management CRUD with built-in template protection
- ✅ Seeder refactored into per-category files with upsert for efficiency
- ✅ Repository + service layer for templates with caching

**Deferred to future iterations:**
- Expand from 44 to 150+ sections (add more seeder category files)
- Template versioning — update without breaking existing pages
- Industry-specific packs (SaaS, restaurant, portfolio, ecommerce)

### SP3: AI Integration ✅
**Completed:**
- ✅ Brand profile management UI — standalone settings page with color palette, font preferences, tone of voice
- ✅ AI section generation — prompt → GrapesJS-compatible HTML+CSS using brand profile + template patterns via SSE streaming
- ✅ AI full page generation — two-step: PageGeneratorAgent plans sections, SectionGeneratorAgent generates each
- ✅ AI content rewriting — floating toolbar over selected text with quick presets (Rewrite, Shorter, Professional, Expand)
- ✅ AI style suggestions — analyze page design, suggest improvements with one-click apply
- ✅ AI image generation — generate images via Laravel AI Image API with aspect ratio control, insert/replace in canvas
- ✅ All AI agents use Laravel AI SDK with `HasStructuredOutput` for reliable JSON responses
- ✅ Collapsible AI drawer in editor with 5 tabbed panels
- ✅ Blade prompt templates with shared partials (brand context, HTML rules, examples)
- ✅ Rate-limited AI endpoints with permission-based access control

### SP4: Responsive System
- Smart responsive defaults via CSS container queries + flexbox/grid
- Breakpoint editor — switch desktop/tablet/mobile and adjust per-device
- Mobile-specific section visibility (hide/show per breakpoint)
- Touch-friendly preview mode
- Auto-responsive audit — flags sections that may break on smaller screens

### Dependency Chain

```
SP1 (Core Engine) → SP2 (Templates) → SP3 (AI) + SP4 (Responsive)
                                        ↑ parallel ↑
```

SP3 and SP4 can run in parallel once SP2 is complete.
