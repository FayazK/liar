# Page Builder SP4: Responsive System — Design Spec

## Overview

Add a responsive design system to the Page Builder module. Admins can switch between Desktop/Tablet/Mobile views and apply per-device style overrides using the same constrained presets. Sections can be hidden per breakpoint. All 44 templates migrate from viewport media queries to container queries for context-aware responsiveness.

**Scope (Core 3):**
1. Smart responsive defaults via CSS container queries
2. Breakpoint editor with per-device style presets
3. Section visibility controls per breakpoint

**Deferred:** Touch-friendly preview mode, auto-responsive audit.

**Browser support:** Container queries require Safari 16+, Chrome 105+, Firefox 110+. All modern browsers as of 2024. No fallback needed for this admin tool and its public pages.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CSS strategy | Container queries (`@container`) | Sections respond to container width, not viewport — works in editor canvas and public pages |
| Breakpoints | Desktop (default), Tablet (768px), Mobile (480px) | Matches common device widths; 480px for mobile instead of 375px for container context |
| Per-device editing depth | Constrained presets only | Same preset categories (spacing, font size, bg, radius) with per-breakpoint overrides. No full CSS exposure. |
| Override cascade | Desktop → Tablet → Mobile (desktop-first) | Desktop is the base. Tablet overrides desktop. Mobile overrides tablet (falls back to tablet, then desktop). |
| Responsive data storage | GrapesJS component attributes | `data-pb-*` traits on components, serialized in existing `grapes_data` JSON. No new DB columns. |
| Visibility UI | Component toolbar toggles | D/T/M icons in GrapesJS component toolbar for section-level components |
| Template migration | All 44 templates | Update all seeder files: `@media` → `@container` |
| Container context | Page-level wrapper, not per-section | `container-type: inline-size` on a wrapper around all sections. Sections are children of the container, so `@container` queries inside sections resolve against the page wrapper width. |
| CSS variable namespace | Keep existing `--section-*` names | Templates already use `--section-bg`, `--section-spacing`, `--section-text`, `--section-accent`. No rename. Add breakpoint suffixes: `--section-spacing-tablet`, etc. |

## Data Model

### No Schema Changes

All responsive data is stored as GrapesJS component attributes within the existing `grapes_data` JSON column on `builder_pages`.

### Component Attributes (Traits)

Each section-level component gets these traits. **Attribute values store raw CSS values, not preset labels** (e.g., `"2rem"` not `"compact"`).

A "section-level component" is defined as: a top-level component in the GrapesJS component tree (direct child of the body/wrapper), or a component whose root element has a CSS class starting with `pb-` (all template sections use this prefix).

| Attribute | Type | Example | Purpose |
|-----------|------|---------|---------|
| `data-pb-hide-desktop` | `"true"` or absent | `data-pb-hide-desktop="true"` | Hide section on desktop |
| `data-pb-hide-tablet` | `"true"` or absent | `data-pb-hide-tablet="true"` | Hide section on tablet |
| `data-pb-hide-mobile` | `"true"` or absent | `data-pb-hide-mobile="true"` | Hide section on mobile |
| `data-pb-spacing-tablet` | CSS value | `data-pb-spacing-tablet="2rem"` | Spacing override for tablet |
| `data-pb-spacing-mobile` | CSS value | `data-pb-spacing-mobile="1rem"` | Spacing override for mobile |
| `data-pb-fontsize-tablet` | CSS value | `data-pb-fontsize-tablet="0.875rem"` | Font size override for tablet |
| `data-pb-fontsize-mobile` | CSS value | `data-pb-fontsize-mobile="0.875rem"` | Font size override for mobile |
| `data-pb-bg-tablet` | CSS color | `data-pb-bg-tablet="#f8f9fa"` | Background override for tablet |
| `data-pb-bg-mobile` | CSS color | — | Background override for mobile |
| `data-pb-radius-tablet` | CSS value | `data-pb-radius-tablet="0"` | Border radius override for tablet |
| `data-pb-radius-mobile` | CSS value | — | Border radius override for mobile |

Desktop values use existing inline styles via `component.addStyle()` (no `data-pb-*-desktop` attributes needed — desktop is the base).

## CSS Architecture

### Container Query Setup

The container context is a **page-level wrapper** that wraps all sections, NOT on each section individually. This is critical because `@container` queries inside a section resolve against the nearest ancestor with `container-type`, which must be a parent element:

```css
/* Page-level wrapper (added by compiler, or in editor canvas) */
.pb-page-container {
  container-type: inline-size;
  width: 100%;
}

/* Sections are children — their @container queries match against pb-page-container */
```

In the **editor**: the GrapesJS canvas wrapper serves as the container context.
In **compiled output**: `PageCompilerService::wrapInContainer()` adds a `<div class="pb-page-container" style="container-type: inline-size;">` wrapper.

### StylePresets Migration: Inline Styles → CSS Variables

**Current behavior:** `StylePresets.tsx` calls `onApply('padding', '4rem')` which maps to `selected.addStyle({ padding: '4rem' })` — this sets inline CSS directly on the component.

**New behavior:** StylePresets must switch to setting CSS custom properties instead of inline CSS properties. This is required for the variable cascade to work.

| Current | New |
|---------|-----|
| `selected.addStyle({ padding: '4rem' })` | `selected.addStyle({ '--section-spacing': '4rem' })` |
| `selected.addStyle({ 'background-color': '#fff' })` | `selected.addStyle({ '--section-bg': '#fff' })` |
| `selected.addStyle({ 'font-size': '1rem' })` | `selected.addStyle({ '--section-fontsize': '1rem' })` |
| `selected.addStyle({ 'border-radius': '8px' })` | `selected.addStyle({ '--section-radius': '8px' })` |

Templates must consume these variables (see Template Migration section). The `handleStylePreset` function in `editor.tsx` is updated to map preset categories to CSS variable names.

For non-desktop devices, instead of `addStyle()`, the preset value is stored as a `data-pb-*` attribute on the component. The compiler generates container query CSS from these attributes.

### Variable Cascade

Desktop values are the base (set as CSS custom properties via `addStyle()`). Tablet and mobile override via container queries. The compiler generates this CSS from `data-pb-*` attributes:

```css
/* Base (desktop) — set via GrapesJS addStyle() as inline CSS variables */
/* e.g., style="--section-spacing: 4rem; --section-bg: #ffffff;" */

/* Template CSS consumes the variables: */
.pb-hero {
  padding: var(--section-spacing, 4rem) 2rem;
  font-size: var(--section-fontsize, 1rem);
  background-color: var(--section-bg, #ffffff);
  border-radius: var(--section-radius, 0);
}

/* Tablet — compiler generates from data-pb-spacing-tablet="2rem" etc. */
@container (max-width: 768px) {
  .pb-hero {
    padding: var(--section-spacing-tablet, var(--section-spacing, 4rem)) 1.5rem;
    font-size: var(--section-fontsize-tablet, var(--section-fontsize, 1rem));
    background-color: var(--section-bg-tablet, var(--section-bg, #ffffff));
    border-radius: var(--section-radius-tablet, var(--section-radius, 0));
  }
}

/* Mobile — falls back to tablet, then desktop */
@container (max-width: 480px) {
  .pb-hero {
    padding: var(--section-spacing-mobile, var(--section-spacing-tablet, var(--section-spacing, 2rem))) 1rem;
    font-size: var(--section-fontsize-mobile, var(--section-fontsize-tablet, var(--section-fontsize, 0.875rem)));
    background-color: var(--section-bg-mobile, var(--section-bg-tablet, var(--section-bg, #ffffff)));
    border-radius: var(--section-radius-mobile, var(--section-radius-tablet, var(--section-radius, 0)));
  }
}
```

### Visibility Rules

```css
/* Visibility — uses !important because it must override any display value */
[data-pb-hide-desktop="true"] { display: none !important; }

/* Restore desktop-hidden sections at smaller sizes */
@container (max-width: 768px) {
  [data-pb-hide-desktop="true"]:not([data-pb-hide-tablet="true"]) {
    display: block !important;
  }
  [data-pb-hide-tablet="true"] { display: none !important; }
}

@container (max-width: 480px) {
  [data-pb-hide-desktop="true"]:not([data-pb-hide-mobile="true"]),
  [data-pb-hide-tablet="true"]:not([data-pb-hide-mobile="true"]) {
    display: block !important;
  }
  [data-pb-hide-mobile="true"] { display: none !important; }
}
```

Note: `display: block` is used instead of `display: revert` because `revert` would revert to the user-agent default, not the element's intended display value. Since hidden sections are full-width block wrappers, `display: block` is correct. For sections that use flex/grid internally, the flex/grid is on an inner element, not the visibility-toggled wrapper.

### Smart Responsive Defaults (Built into Templates)

All templates include smart defaults that don't require admin intervention:

- **Grid layouts** → single column below 768px: `grid-template-columns: 1fr`
- **Horizontal spacing** → reduces at smaller widths: `2rem → 1.5rem → 1rem`
- **Font sizes** → scale down proportionally
- **Images** → `max-width: 100%` always
- **Multi-column grids** → `repeat(auto-fit, minmax(280px, 1fr))` for natural reflow

## GrapesJS Plugin: `responsivePlugin`

**File:** `Modules/PageBuilder/resources/js/lib/grapes-plugins.ts`

### Responsibilities

1. **Register responsive traits** on section-level components (visibility + preset overrides)
2. **Add toolbar buttons** for D/T/M visibility toggles on selected sections
3. **Emit `responsive:device-changed`** event when device switches
4. **Inject container query CSS** into canvas iframe so previews work at narrowed widths
5. **Show visual indicators** in canvas for hidden sections (subtle overlay + label)

### Section Component Detection

A component is a "section component" if:
- It is a direct child of the GrapesJS body wrapper, OR
- Its root HTML element has a CSS class starting with `pb-` (all seeded templates follow this convention)

```typescript
function isSectionComponent(component: Component): boolean {
  const parent = component.parent();
  if (!parent || parent.is('body') || !parent.parent()) return true;
  const classes = component.getClasses();
  return classes.some(cls => cls.startsWith('pb-'));
}
```

### Trait Registration

When a section component is selected:

```typescript
editor.on('component:selected', (component) => {
  if (isSectionComponent(component)) {
    ensureResponsiveTraits(component);
  }
});
```

Traits added: visibility toggles (checkbox per device) and preset override dropdowns (matching existing preset options).

### Canvas Preview

When the active device changes, the plugin:
1. Gets the canvas iframe document
2. Injects/updates a `<style id="pb-responsive-preview">` element with visibility rules
3. Sets `--section-*-tablet` / `--section-*-mobile` CSS variables from `data-pb-*` attributes on each component
4. Sections visually respond because the canvas width changes and container queries activate

## Frontend Component Changes

### `editor.tsx`

- Add breakpoint indicator pill: `"Editing: Tablet (768px)"` shown when device ≠ Desktop
- Pass `activeDevice` state to `StylePresets` component
- Pass `editor` ref to `StylePresets` so it can read/write component attributes
- Update `handleStylePreset` to:
  - Desktop: `selected.addStyle({ '--section-{property}': value })` (CSS variable)
  - Tablet/Mobile: `selected.addAttributes({ 'data-pb-{property}-{device}': value })`

### `StylePresets.tsx`

Major update to support per-device editing:

- **New props:** `activeDevice: 'Desktop' | 'Tablet' | 'Mobile'`, `editor: Editor | null`
- **Device badge:** Shows current device in panel header
- **Per-preset indicators:**
  - `● override` (red) — this device has a custom value (read from component's `data-pb-*` attribute)
  - `○ inherited` (gray) — using parent device's value, shown with dashed border on the inherited preset
- **Preset selection behavior:**
  - Desktop: calls `onApply` which sets CSS custom property via `addStyle()`
  - Tablet/Mobile: sets `data-pb-{preset}-{device}` attribute on selected component via `addAttributes()`
- **Active value display:** When a component is selected, reads its current CSS variables (desktop) or data attributes (tablet/mobile) to highlight the active preset
- **Clear All Overrides button:** Removes all `data-pb-*-{device}` attributes for current device from the selected component

### `grapes-config.ts`

Update device manager:
- Desktop: full width (unchanged)
- Tablet: 768px (unchanged)
- Mobile: 480px (changed from 375px to match container query breakpoint)

### `grapes-plugins.ts`

Add `responsivePlugin` function (see plugin section above). Registered alongside existing `stylePresetsPlugin` and `devicePreviewPlugin`.

## Backend Changes

### `PageCompilerService.php`

Extend `compile()` method:

1. **Parse `data-pb-*` attributes** from the HTML being compiled
2. **Generate container query CSS** for visibility and preset overrides
3. **Wrap compiled HTML** in a container wrapper with `container-type: inline-size`
4. **Strip `data-pb-*` attributes** from final HTML (CSS is generated, attributes no longer needed)
5. **Append container query CSS** to `compiled_css`

New private methods:
- `generateResponsiveCss(string $html): string` — scans HTML for `data-pb-*` attributes, generates container query CSS blocks with the variable cascade pattern
- `wrapInContainer(string $html): string` — adds container wrapper with `container-type: inline-size` to root
- `stripResponsiveAttributes(string $html): string` — removes `data-pb-*` from final HTML output

### AI Prompt Templates

Update Blade prompt partials:

- **`partials/html-rules.blade.php`** — Add container query instructions:
  - Use `@container` queries instead of `@media` queries (do NOT add `container-type` to sections — the page wrapper handles that)
  - Document the full set of CSS variables AI should use:
    - Existing: `--section-bg`, `--section-text`, `--section-accent`, `--section-spacing`
    - New: `--section-fontsize` (font size), `--section-radius` (border radius)
    - Breakpoint variants: append `-tablet` or `-mobile` for responsive overrides
  - Include responsive defaults (grid stacking, reduced spacing)
- **`partials/example-sections.blade.php`** — Update example HTML/CSS to use container queries and `--section-*` variables

## Template Migration

### Seeder Updates

All 12 category seeder files in `Modules/PageBuilder/database/seeders/Templates/`:

For each template:
1. Do NOT add `container-type` to individual sections (the page-level wrapper provides it)
2. Replace `@media (max-width: 768px)` → `@container (max-width: 768px)`
3. Replace `@media (min-width: 769px) and (max-width: 1024px)` → `@container (max-width: 768px)` (collapse tablet range — the old 1024px upper bound is no longer needed since we're using container width, not viewport width)
4. Add `@container (max-width: 480px)` rules for mobile-specific defaults
5. Migrate inline styles to CSS custom properties where they map to presets:
   - `padding: X` → `padding: var(--section-spacing, X)`
   - `background-color: X` → `background-color: var(--section-bg, X)`
   - `font-size: X` → `font-size: var(--section-fontsize, X)`
   - `border-radius: X` → `border-radius: var(--section-radius, X)`
6. Remove `!important` where container queries make it unnecessary

### Existing Published Pages

Already-published pages have `compiled_html` and `compiled_css` with `@media` queries baked in. These will continue to work (media queries still function). To upgrade them:
- Add an artisan command `page-builder:recompile` that recompiles all published pages
- Run after seeder migration to regenerate compiled output with container queries
- Not strictly required (old pages still work) but recommended for consistency

### Migration Command

```bash
php artisan db:seed --class=Modules\\PageBuilder\\Database\\Seeders\\SectionTemplateSeeder
php artisan page-builder:recompile  # optional: recompile existing published pages
```

## Files to Modify

| File | Change |
|------|--------|
| `resources/js/lib/grapes-plugins.ts` | Add `responsivePlugin` |
| `resources/js/lib/grapes-config.ts` | Update mobile device width to 480px |
| `resources/js/components/StylePresets.tsx` | Per-device editing, override indicators, CSS variable output |
| `resources/js/pages/admin/page-builder/editor.tsx` | Breakpoint indicator, pass activeDevice, update handleStylePreset to set CSS variables |
| `app/Services/PageCompilerService.php` | Container query CSS generation, attribute parsing, container wrapper |
| `database/seeders/Templates/*.php` (12 files) | @media → @container migration, inline styles → CSS variables |
| `resources/views/prompts/partials/html-rules.blade.php` | Container query instructions for AI |
| `resources/views/prompts/partials/example-sections.blade.php` | Updated examples with container queries |

## New Files

| File | Purpose |
|------|---------|
| `app/Console/Commands/RecompilePagesCommand.php` | Artisan command to recompile all published builder pages |

## Files NOT Modified

- No new database migrations
- No new models or repositories
- No new controllers or routes (except artisan command)
- No new service classes
- `grapes-blocks.ts` — unchanged (blocks register from templates which are updated via seeders)

## Testing

### Feature Tests

- `PageCompilerService` generates correct container query CSS from `data-pb-*` attributes
- `PageCompilerService` wraps compiled output in container wrapper with `container-type: inline-size`
- `PageCompilerService` strips `data-pb-*` attributes from final HTML
- `PageCompilerService` generates correct visibility CSS with proper cascade
- Templates compile correctly with container queries
- Public page renders with responsive CSS
- `RecompilePagesCommand` recompiles all published pages

### Browser Tests (Playwright)

- Switch device in editor → canvas resizes to correct width
- Select section → visibility toggles appear in toolbar
- Toggle mobile visibility → section shows hidden overlay in mobile view
- Change spacing preset on tablet → override indicator appears
- Clear overrides → values revert to desktop
- Publish → public page has container query CSS
- Public page responds to viewport width correctly
