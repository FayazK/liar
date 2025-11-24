# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working with code in this repository.

---

## Technology Stack & Versions

- **PHP**: 8.3+ (strict types, typed class constants, readonly classes, json_validate(), #[\Override])
- **Laravel**: 12+ (automatic eager loading, native health checks)
- **React**: 19+ (Actions, useOptimistic, useFormStatus, useActionState, React Compiler, ref as prop)
- **TypeScript**: 5.0+ (strict mode required)
- **Node.js**: 20+ LTS
- **Inertia.js**: 2.x (SSR enabled)
- **Ant Design**: React 19 compatible (theme tokens for dark/light mode)
- **Tailwind CSS**: v4 (utility-first, CSS-first configuration)
- **Laravel Wayfinder**: Type-safe route generation
- **Pest**: PHP testing framework
- **SQLite**: Development database

---

## Development Commands

### Frontend
- `npm run dev` - Vite dev server with HMR
- `npm run build` - Production build
- `npm run build:ssr` - SSR build
- `npm run lint` - ESLint auto-fix
- `npm run format` - Prettier formatting
- `npm run types` - TypeScript type checking

### Backend
- `composer dev` - Full stack (Laravel + queue + logs + Vite)
- `composer dev:ssr` - Development with SSR
- `composer test` - Run Pest tests
- `php artisan serve` - Laravel server only
- `php artisan test --filter=TestName` - Specific test
- `php artisan pail` - Real-time logs
- `php artisan optimize:clear` - Clear all caches

---

## Architecture Pattern: Service-Repository

**Flow**: Controller (HTTP) → Service (Business Logic) → Repository (Data Access) → Model → Database

**Controllers**: Accept requests, validate input, call services, return responses - nothing else
**Services**: Implement business logic, coordinate repositories, handle transactions and events
**Repositories**: Abstract database operations behind interfaces, injected via DI, one interface per repository
**Models**: Define relationships and accessors only - no business logic or queries

---

## Directory Structure

```
app/Http/Controllers/     # Thin controllers, HTTP only
app/Services/             # Business logic
app/Repositories/         # Data access (with interfaces)
app/Models/               # Eloquent models
resources/js/pages/       # Inertia page components
resources/js/components/  # Reusable components
  └── ui/                # Design system (Ant Design wrappers)
resources/js/layouts/     # Page layouts (auth/, app/, settings/)
resources/js/actions/     # Wayfinder generated routes
resources/js/hooks/       # Custom React hooks
resources/js/types/       # TypeScript definitions
tests/Feature/           # Feature tests (preferred)
tests/Unit/              # Unit tests (minimal)
```

---

## PHP 8.3 Standards

✓ Start every PHP file with `declare(strict_types=1);`
✓ Type all properties, parameters, and return types explicitly
✓ Use typed class constants for all class constants
✓ Add `#[\Override]` attribute when overriding parent methods
✓ Use readonly classes for DTOs and value objects
✓ Validate JSON with `json_validate()` before decoding
✓ Use constructor property promotion with types
✓ Follow PSR-12 for code style

✗ Never use untyped properties or parameters
✗ Never omit return types (use void if no return)
✗ Never use mixed types unless absolutely necessary

---

## TypeScript Standards

✓ Enable strict mode and all strict flags in tsconfig
✓ Use `unknown` for uncertain types, narrow with type guards
✓ Define explicit interfaces for all component props
✓ Use discriminated unions for state with status field
✓ Apply template literal types for route and enum patterns
✓ Type error objects in catch blocks explicitly

✗ Never use `any` type - always use `unknown` instead
✗ Never leave function parameters or return types implicit
✗ Never ignore TypeScript errors with @ts-ignore

---

## KISS & DRY Principles

**KISS**: Always choose the simplest solution - avoid premature abstraction, unnecessary interfaces, and clever code
**DRY**: Extract common code only after third repetition (Rule of Three) - prefer duplication over wrong abstraction
**When to abstract**: Pattern is clear, stable, and appears 3+ times in similar contexts
**When NOT to abstract**: Code coincidentally similar, domains likely to diverge, pattern not yet clear

---

## Performance Requirements

### Laravel
✓ Always eager load relationships with `->with()` - N+1 prevention is critical
✓ Add `Model::preventLazyLoading(!app()->isProduction())` in AppServiceProvider
✓ Select only needed columns and specify columns in relationships
✓ Index all foreign keys and frequently queried columns
✓ Use composite indexes for multi-column WHERE clauses
✓ Chunk large datasets with `->chunk(100)` to prevent memory issues
✓ Cache expensive queries with tags for granular invalidation
✓ Queue long-running operations instead of blocking requests

### React 19
✓ Let React Compiler handle optimization - no manual useMemo/useCallback
✓ Code split large routes with lazy() and Suspense
✓ Virtualize lists over 100 items with react-window
✓ Add lazy loading and dimensions to images
✓ Leverage React 19 automatic batching

---

## Security (OWASP Top 10)

**Input Validation**:
✓ Always use Form Requests - validate all user input on server
✓ Validate on both client and server - never trust client alone
✓ Use whitelist validation - specify allowed values explicitly
✗ Never use `$request->all()` directly in create/update
✗ Never skip validation because "it's validated on frontend"

**XSS Prevention**:
✓ Use Blade `{{ }}` for output escaping automatically
✓ Use React JSX for automatic escaping
✓ Sanitize HTML with Purify before using `{!! !!}` or dangerouslySetInnerHTML
✗ Never use raw HTML output without sanitization

**SQL Injection Prevention**:
✓ Use Eloquent or Query Builder exclusively
✓ Use parameter bindings if raw queries required
✗ Never concatenate user input into SQL queries
✗ Never disable parameterized queries

**Authentication & Authorization**:
✓ Protect routes with auth middleware
✓ Use policies and gates for authorization
✓ Call `$this->authorize()` before sensitive operations
✗ Never check permissions manually - use Laravel's built-in tools

**File Uploads**:
✓ Validate MIME type and extension
✓ Limit file sizes appropriately
✓ Store uploads outside public directory
✓ Generate unique filenames with UUID
✗ Never trust file extensions from users
✗ Never store uploaded files in public directory

**Environment Variables**:
✓ Use `config()` in application code
✓ Access `env()` only in config files
✗ Never commit .env file to version control
✗ Never hardcode credentials or API keys

---

## React 19 Patterns

✓ Use `useActionState` for forms - handles state, loading, and errors automatically
✓ Use `useOptimistic` for instant UI updates with auto-rollback on errors
✓ Use `useFormStatus` for submit button pending states
✓ Pass `ref` as regular prop - forwardRef is obsolete
✓ Use `use()` hook for Promises and Context - can be conditional
✓ Let React Compiler memoize automatically

**State Management**:
- Inertia shared data for global state (user, flash messages, app config)
- Custom hooks for component-specific state and logic
- Context for theme/appearance that changes rarely
- React 19 Actions for all form submissions

---

## Testing with Pest

✓ Prefer feature tests that test complete user flows over isolated unit tests
✓ Use AAA pattern: Arrange test data, Act on system, Assert results
✓ Focus tests on critical business logic and user flows
✓ Write descriptive test names that explain what is being tested
✓ Use `describe()` blocks to organize related tests
✓ Use factories for all test data
✗ Don't aim for 100% coverage - test what matters
✗ Don't test framework features or trivial getters/setters

---

## Ant Design & Theming

✓ Wrap app in ConfigProvider with theme configuration
✓ Use `theme.darkAlgorithm` or `theme.defaultAlgorithm` based on user preference
✓ Get colors from `theme.useToken()` hook - never hardcode
✓ Use theme tokens: colorPrimary, colorBgContainer, colorText, colorBorder
✓ Combine Tailwind utilities with Ant Design components
✓ Define CSS variables that adapt to theme for custom colors
✗ Never hardcode color values in components
✗ Never use Ant Design without theme tokens

---

## UI/UX Design Standards

### Visual Design (Shadow-Free)

**This project uses a flat, shadow-free design aesthetic**

✓ Use solid backgrounds with clear borders for depth and separation
✓ Create hierarchy through color, spacing, and typography (not shadows)
✓ Use border-radius for modern feel without shadows
✓ Leverage whitespace generously for clarity and breathing room
✓ Apply consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
✓ Differentiate interactive elements with color and border changes
✗ Never add box-shadow, drop-shadow, or text-shadow to any element
✗ Never use neumorphism or material design shadow patterns
✗ Never rely on shadows to indicate clickable elements

### Typography & Readability

✓ Body text minimum 16px (responsive to 14px on mobile if necessary)
✓ Line height 1.5-1.6 for body text (150-160%)
✓ Left-align all text blocks (never justify)
✓ Limit to 3 font families maximum
✓ Use font weight and size for hierarchy (not just color)
✓ Maintain heading structure: H1 → H2 → H3 (never skip levels)
✓ Keep line length 50-75 characters for optimal readability
✗ Never use font sizes below 12px
✗ Never use low-contrast text (minimum 4.5:1 for body, 3:1 for large text)
✗ Never use all-caps for long text (titles only)

### Color & Contrast (WCAG 2.2)

✓ Test all color combinations for 4.5:1 contrast minimum (normal text)
✓ Ensure 3:1 contrast for UI components and large text (19px+)
✓ Use color plus another indicator (icon, text, pattern) - never color alone
✓ Design for colorblind users (test with simulators)
✓ Use Ant Design theme tokens for all colors
✓ Maintain consistent color meaning (red=error, green=success, blue=info)
✗ Never rely on color alone to convey information or state
✗ Never use low contrast for aesthetic reasons
✗ Never hardcode hex colors in components

### Accessibility Requirements

**Touch Targets & Spacing:**
✓ Minimum 44×44 pixels for all interactive elements (buttons, links, inputs)
✓ Minimum 8px spacing between interactive elements
✓ Larger targets for primary actions (48×48 or bigger)

**Keyboard Navigation:**
✓ All functionality must work with keyboard only (Tab, Enter, Space, Arrows)
✓ Visible focus indicators with 3:1 contrast minimum
✓ Focus indicator at least 2px thick
✓ Logical tab order (left-to-right, top-to-bottom)
✓ Provide skip links to main content
✗ Never create keyboard traps (user can always exit modals/dropdowns)
✗ Never remove focus indicators without replacing them
✗ Never use mouse-only interactions

**Semantic HTML:**
✓ Use correct elements: button, a, nav, main, header, footer, article, section
✓ Use one H1 per page, maintain heading hierarchy
✓ Use label elements for all form inputs
✓ Use semantic HTML before adding ARIA (No ARIA is better than bad ARIA)
✓ Add alt text to all meaningful images
✗ Never use div/span with onClick when button/a is appropriate
✗ Never skip heading levels (H1 to H3)
✗ Never use placeholders as labels

### Human-Centered Content (Critical)

**Write for non-technical users with basic computer literacy (email, browsing)**

**Buttons & Actions:**
✓ Use action verbs that describe what happens: "Save Changes" "Create Account" "Download Report"
✓ Be specific about outcomes: "Send Message" not "Submit"
✓ Keep to 2-3 words when possible
✗ Never use technical jargon: "Submit" "Execute" "Deploy" "Authenticate"
✗ Never use vague labels: "OK" "Yes" "Continue" "Next" "Back"
✗ Never use developer terms visible to users

**Error Messages:**
✓ Explain what happened in plain language
✓ Explain why (if known)
✓ Tell users exactly how to fix it
✓ Be polite and helpful (never blame the user)
✓ Example: "Please check your email address - it needs to include an @ symbol"
✗ Never show technical errors: "Error 422: Validation failed" "NullPointerException"
✗ Never use generic messages: "An error occurred" "Something went wrong"
✗ Never use negative language: "Don't forget to..." → "Remember to..."

**Success Messages:**
✓ Confirm the action completed clearly
✓ Be specific about what happened
✓ Guide to next steps if applicable
✓ Example: "Your profile has been updated. Changes are visible immediately."
✗ Never leave users wondering if action worked
✗ Never use silent success (always confirm)

**General Copy:**
✓ Use conversational, friendly tone (write like talking to a person)
✓ Use active voice: "Save your changes" not "Changes will be saved"
✓ Use simple, everyday language (8th grade reading level)
✓ Use "you" and "your" to address users directly
✗ Never use technical terms without explanation
✗ Never use passive voice unnecessarily
✗ Never be overly formal or robotic
✗ Never use jargon: "authenticate" → "sign in", "parameters" → "settings"

### Form Design

**Structure & Labels:**
✓ Keep forms as short as possible (only essential fields)
✓ Use visible labels above or left of fields (always visible)
✓ Group related fields together with whitespace
✓ Use appropriate input types (email, tel, date, number for better mobile keyboards)
✓ Show password requirements before user starts typing
✓ Use help text below fields for clarification (not in placeholders)
✗ Never use placeholders as labels (they disappear when typing)
✗ Never show errors while user is still typing (premature validation)
✗ Never hide essential information in tooltips

**Validation & Errors:**
✓ Validate inline on blur (when user leaves field)
✓ Show errors immediately below the problem field
✓ Use red color plus error icon (not color alone)
✓ Provide specific, helpful error messages
✓ Mark required fields clearly with asterisk or "(required)"
✓ Disable submit button during processing with loading state
✗ Never validate while user is still typing
✗ Never show generic errors at top of form only
✗ Never use vague validation messages

### Loading States & Feedback

**Skeleton Screens (Preferred):**
✓ Use skeleton screens for page/section loading (better than spinners)
✓ Match skeleton structure to actual content layout
✓ Animate with subtle shimmer or pulse
✓ Replace progressively as content loads
✓ Use for loads expected to take 2-10 seconds
✗ Never use for loads under 1 second (distracting)
✗ Never show static skeleton indefinitely

**Loading Indicators:**
✓ Use spinners for small operations (button actions, table rows)
✓ Show progress percentage for long operations (>10 seconds)
✓ Disable buttons during processing
✓ Update button text to show status: "Saving..." "Processing..."
✗ Never leave users guessing if something is happening
✗ Never use spinners for full-page loading (use skeleton instead)

**Optimistic Updates:**
✓ Update UI immediately for common actions (likes, favorites, simple edits)
✓ Provide rollback if server action fails
✓ Show error if action fails with option to retry
✗ Never use for critical operations (payments, deletions)
✗ Never leave UI in wrong state if action fails

### Empty States

✓ Explain why content area is empty
✓ Provide clear call-to-action to populate
✓ Use friendly illustration or icon
✓ Keep message positive and helpful
✓ Example: "You haven't created any projects yet. Click 'New Project' to get started."
✗ Never show just "No results" or "Empty"
✗ Never leave users confused about what to do

### Navigation & Wayfinding

✓ Keep navigation consistent across all pages
✓ Highlight current page/section clearly
✓ Use clear, descriptive labels (not clever/ambiguous names)
✓ Limit top-level nav to 5-7 items
✓ Provide breadcrumbs for deep hierarchies
✓ Make all nav items keyboard accessible
✗ Never use icon-only navigation without labels or tooltips
✗ Never change nav structure between sections
✗ Never hide essential navigation

### Responsive & Mobile

✓ Design mobile-first, then scale up
✓ Use bottom navigation for mobile complex apps
✓ Ensure touch targets are 44×44 minimum on mobile
✓ Test on real devices (not just browser resize)
✓ Use native input types for better mobile keyboards
✓ Stack elements vertically on mobile
✗ Never make mobile users zoom/pan to interact
✗ Never hide important features on mobile
✗ Never assume users have large screens

---

## Inertia.js & Wayfinder

✓ Always use Wayfinder's `route()` function imported from @/actions
✓ Get type-safe navigation, links, and form submissions from Wayfinder
✓ Define TypeScript interfaces for all Inertia page props
✓ Use `<Head title="..." />` for page titles
✓ Configure shared data in HandleInertiaRequests middleware
✓ Access shared data via `usePage<PageProps>().props`
✗ Never hardcode route URLs or paths
✗ Never skip prop type definitions for Inertia pages

---

## Anti-Patterns to AVOID

**Over-Engineering**:
✗ Creating unnecessary interface hierarchies before patterns emerge
✗ Abstracting before code is repeated 3+ times
✗ Using abstract classes when simple interfaces work
✗ Building "flexible" solutions for hypothetical future requirements

**Performance**:
✗ Forgetting to eager load relationships (causes N+1 queries)
✗ Loading relationships inside loops
✗ Missing indexes on foreign keys and queried columns
✗ Selecting all columns when only few are needed

**Architecture**:
✗ Putting business logic in controllers
✗ Querying models directly in controllers
✗ Skipping validation on user input
✗ Using repositories without interfaces

**Type Safety**:
✗ Using `any` type in TypeScript
✗ Missing `declare(strict_types=1)` in PHP
✗ Leaving parameters or returns untyped
✗ Disabling TypeScript strict mode

**Security**:
✗ Using `$request->all()` without validation
✗ Hardcoding credentials, API keys, or secrets
✗ Skipping input validation
✗ Empty catch blocks that hide errors

**Code Quality**:
✗ Hardcoding values instead of using config
✗ Duplicating code that has diverged
✗ Using unclear single-letter variable names
✗ Writing complex nested ternaries

**UI/UX**:
✗ Adding shadows (box-shadow, drop-shadow, text-shadow)
✗ Using technical jargon in user-facing text
✗ Vague button text ("Submit" "OK" "Continue")
✗ Generic error messages ("Error occurred" "Invalid input")
✗ Placeholders as labels (labels must always be visible)
✗ Touch targets smaller than 44×44 pixels
✗ Low contrast text or UI elements
✗ Missing keyboard navigation or focus indicators
✗ Hardcoded colors instead of theme tokens
✗ Validating forms while user is still typing

---

## Development Checklist

Before committing code:

**Code Quality:**
- [ ] All PHP files start with `declare(strict_types=1);`
- [ ] TypeScript strict mode enabled with all strict flags
- [ ] Service-Repository pattern followed with interfaces
- [ ] Controllers under 20 lines per method
- [ ] KISS applied - simplest solution chosen
- [ ] DRY applied - Rule of Three followed
- [ ] Code is self-documenting with clear names

**Security & Validation:**
- [ ] All user input validated with Form Requests
- [ ] Security best practices followed (OWASP)
- [ ] Environment variables used for configuration
- [ ] No hardcoded credentials or sensitive data

**Performance:**
- [ ] All relationships eager loaded to prevent N+1
- [ ] Database indexes added for queried columns
- [ ] React 19 Compiler leveraged (no manual memoization)

**Testing:**
- [ ] Feature tests written for critical flows
- [ ] Edge cases and error scenarios tested

**UI/UX:**
- [ ] No shadows used anywhere (box-shadow, drop-shadow, text-shadow)
- [ ] All interactive elements minimum 44×44 pixels
- [ ] Color contrast meets WCAG 2.2 (4.5:1 for text, 3:1 for UI)
- [ ] All functionality works with keyboard only
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Semantic HTML used (button, a, nav, main, header, footer)
- [ ] All form inputs have visible labels (not just placeholders)
- [ ] Button text is action-oriented: "Save Changes" not "Submit"
- [ ] Error messages are helpful: what happened, why, how to fix
- [ ] Success messages confirm what happened
- [ ] No technical jargon visible to users
- [ ] Loading states shown for operations over 1 second
- [ ] Empty states provide clear next actions
- [ ] Mobile responsive with touch targets 44×44 minimum
- [ ] Ant Design theme tokens used (no hardcoded colors)

**Routes & Data:**
- [ ] Wayfinder routes used instead of hardcoded URLs
- [ ] TypeScript interfaces defined for all Inertia page props
- [ ] React 19 Actions used for forms

---

**Core Philosophy**: Write simple, well-tested, secure code that follows proven patterns. Code for humans first, computers second.
