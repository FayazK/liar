# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Laravel backend (Controllers, Requests, Resources, Services, Repositories).
- `resources/js`: React + TypeScript pages/components; `resources/css` styles; `resources/views/app.blade.php` layout.
- `routes/`: `web.php`, `auth.php`, `admin.php`, `settings.php` route files.
- `tests/`: Pest tests under `Feature/` and `Unit/`.
- `database/`: migrations, seeders (e.g., `WorldSeeder`), factories.
- `config/`, `public/`, `bootstrap/`, `storage/`: standard Laravel directories.

## Build, Test, and Development Commands
- Install deps: `composer install` and `npm ci`.
- Env setup: `cp .env.example .env && php artisan key:generate`.
- Run app locally: `composer dev` (serves Laravel, Vite, queue, and logs).
- Build assets: `npm run build` (SSR: `npm run build && npm run build:ssr` or `composer dev:ssr`).
- Type check: `npm run types`.
- Tests: `composer test` or `./vendor/bin/pest`.

## Coding Style & Naming Conventions
- PHP: Laravel Pint (`vendor/bin/pint`), PSR-12, 4-space indents. Classes StudlyCase; methods camelCase. Files: `*Controller.php`, `*Request.php`, `*Resource.php`.
- Frontend: Prettier (4 spaces, single quotes, width 150); ESLint with React/TS. Components PascalCase (`MyComponent.tsx`), hooks `use-*.tsx`, utilities in `resources/js/lib`, pages under `resources/js/pages/...`.
- Use organized imports (Prettier plugin) and avoid unused exports.

## Testing Guidelines
- Framework: Pest + PHPUnit. Place new tests in `tests/Feature` or `tests/Unit` named `SomethingTest.php`.
- Prefer factories/seeders for data. Keep tests isolated and fast.
- Run all tests locally before PRs: `./vendor/bin/pest` (coverage: `XDEBUG_MODE=coverage ./vendor/bin/pest --coverage`).

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`). Example: `feat(users): add server-side pagination`.
- PRs: include purpose, summary of changes, linked issues, and UI screenshots when relevant. Ensure CI passes (lint, style, tests) and update docs as needed.

## Security & Configuration Tips
- Never commit secrets; use `.env`. Clear cached config when needed: `php artisan config:clear`.
- Default DB is SQLite (see `post-create-project-cmd`); adjust `.env` for other drivers.
