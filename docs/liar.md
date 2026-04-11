# Liar — Application Review

_Last reviewed: 2026-04-11_

**Repository:** https://github.com/FayazK/liar

## What It Is

**Liar** is a full-stack Laravel 12 + React 19 admin platform / CMS starter. It combines a role-based admin dashboard, a WordPress-style content module (posts and pages), a Finder-style file library, a versioned REST API, and fresh AI-provider integration. The architecture is service-repository, the frontend is Inertia + Ant Design v6 + Tailwind v4, and the codebase follows the project's strict conventions (typed PHP, strict TypeScript, DataTable-driven CRUD).

## Tech Stack

**Backend**
- PHP 8.2+, Laravel 12.0
- Laravel Sanctum 4.2 (API tokens)
- Laravel Horizon 5.43 (Redis queues)
- Laravel Wayfinder 0.1.10 (typed route generation)
- **laravel/ai 0.2.1** (multi-provider AI — newly integrated)
- spatie/laravel-medialibrary 11, spatie/laravel-permission-style RBAC (custom)
- aliziodev/laravel-taxonomy 2.8, plank/metable 6.2, nnjeim/world 1.1
- Pest 4.0 + Mockery for testing

**Frontend**
- React 19.2, Inertia.js 2.3, TypeScript 5.9, Vite 7.3
- Tailwind CSS 4.1, Ant Design 6.1
- TipTap 2.27 (rich text), TanStack Table 8 + Query 5
- dnd-kit 6.3, Zustand 5

**Infra**
- SQLite (dev), Redis (queue), Horizon dashboard

## Architecture

Strict **Controller → Service → Repository → Model** flow:

```
app/Http/Controllers/   26 controllers (Admin, Api/V1, Auth, Settings)
app/Services/            7 services  (User, Role, Permission, Post, Library, Media, Token)
app/Repositories/        8 repositories (+ interfaces, DI-injected)
app/Models/              6 models (User, Post, Role, Permission, Library, Taxonomy)
app/Http/Requests/      25 form requests
app/Http/Resources/     13 API resources
app/Http/Middleware/     6 custom (admin, permission, Inertia, appearance, API JSON, token-ability)
app/Enums/               2 (PostStatus, PostType)
app/Policies/            authorization policies
```

DataTable-driven CRUD uses dedicated **Query Services** (`RoleDataTableQueryService`, `PostDataTableQueryService`) for server-side pagination, filtering, sorting, and column persistence.

## Implemented Features

### Authentication & RBAC
- Register, login, email verification, password reset/forgot, confirm-password
- Role-based access control with granular permissions (view/create/update/delete per module)
- "Root" super-admin bypass
- Sanctum personal access tokens with token abilities derived from role permissions

### Admin Modules
- **Users** — full CRUD, role assignment, DataTable index
- **Roles** — full CRUD, permission assignment matrix
- **Permissions** — management interface
- **Posts** — WordPress-style with two types (`blog-post`, `page`), status enum, soft deletes, taxonomies, featured images, SEO meta fields, TipTap rich-text editor
- **Library** — Finder-style file manager with folder hierarchy, favorites, quick access, drag-and-drop, Spatie MediaLibrary backing

### REST API (v1)
- `POST /api/v1/auth/{login,register,logout,refresh,password/forgot,password/reset}`
- `GET /api/v1/auth/user`
- `GET|POST|PATCH|DELETE /api/v1/users`
- `GET /api/v1/roles`
- JSON:API-style error envelope, 60 req/min rate limit, CORS, version header
- OpenAPI spec at `docs/api/openapi.json`

### AI Integration (newest work)
- `laravel/ai` config, migrations (`agent_conversations`), and stubs published
- Provider keys wired for: Anthropic, OpenAI, Gemini, Cohere, Mistral, Ollama, Groq, DeepSeek, OpenRouter, Azure OpenAI, x.ai, Jina, VoyageAI, ElevenLabs

### Frontend (23 pages)
Auth (6), dashboard, settings (account/profile/password/appearance), users (index/create/edit), roles (index/create/edit), posts (index/create/edit), library, welcome, dev test pages.

30+ shared components: `DataTable`, `RichTextEditor`, `ContentHeader`, modal system, taxonomy dropdowns with multi-select, etc.

## Database

15 migrations covering: `users`, `roles`, `permissions`, `permission_role`, `personal_access_tokens`, `posts` (with soft deletes), `taxonomies`, `libraries`, `media`, `agent_conversations`, `cache`, `jobs`, plus framework tables.

Factories: User, Role, Post, Taxonomy. Seeders include demo data and an `InstallAppCommand` for one-shot setup.

## Test Coverage

- **6 feature tests**: Dashboard, AdminAreaAuthorization, HorizonAuthorization, DropdownTaxonomy, Post, Example
- **1 unit test**: Example

Coverage is foundational — auth boundaries and a couple of critical flows are guarded, but the bulk of CRUD and API surface is currently untested. This is the largest gap in the codebase.

## Development Progress

**Estimated completeness: ~60–70% of a feature-complete admin CMS.**

| Area | Status |
|---|---|
| Auth & RBAC | ✅ Complete |
| User / Role / Permission CRUD | ✅ Complete |
| Posts (blog + pages) | ✅ Complete |
| File Library | ✅ Complete |
| REST API v1 (auth + users + roles) | ✅ Implemented |
| AI integration | 🟡 Wired, not yet surfaced in UI |
| Test coverage | 🟡 Foundational only |
| Public-facing site | 🟡 Welcome/home converted, no full public CMS rendering |
| Additional API resources (posts, library) | ⬜ Not yet exposed |

### Build Inventory
- 26 controllers, 7 services, 8 repositories, 6 models, 25 form requests, 13 API resources, 6 middleware, 15 migrations, 23 React pages, 7 tests.

### Recent Trajectory (git log)
1. laravel/ai config + migrations + stubs published
2. laravel/ai added to composer + docs
3. playwright-cli skill docs
4. Post author handling refactor (auto-assign current user)
5. WordPress-like Post module (blog posts + pages)

Active development is currently focused on **AI capabilities** layered on top of the existing admin foundation.

## Strengths
- Clean service-repository separation, no business logic in controllers
- Strict typing on both PHP (`declare(strict_types=1)`) and TypeScript sides
- Consistent CRUD UX pattern (clickable rows → edit page, delete in danger zone)
- Modern stack throughout (React 19, Tailwind 4, AntD 6, Pest 4, Inertia 2)
- Wayfinder-typed routes prevent hardcoded URLs
- Production-grade auth, RBAC, and queue infrastructure already in place

## Gaps
- Test coverage is sparse relative to surface area
- AI integration is plumbed but has no user-facing feature yet
- Posts and Library are not yet exposed via the v1 API
- No public-facing rendering of CMS content beyond the welcome page
