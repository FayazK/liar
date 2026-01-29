<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\spin;

class InstallAppCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install
                            {--fresh : Drop all tables and re-run migrations}
                            {--seed : Run database seeders}
                            {--force : Force the operation in production}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install and set up the application database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->isProduction() && ! $this->confirmProduction()) {
            return Command::SUCCESS;
        }

        $this->newLine();
        $this->components->info('Installing application...');

        if (! $this->runDatabaseSetup()) {
            return Command::FAILURE;
        }

        if (! $this->runWorldInstall()) {
            return Command::FAILURE;
        }

        if (! $this->runMigrations()) {
            return Command::FAILURE;
        }

        if ($this->shouldSeed() && ! $this->runSeeders()) {
            return Command::FAILURE;
        }

        $this->clearCaches();

        $this->newLine();
        $this->components->success('Application installed successfully!');

        return Command::SUCCESS;
    }

    /**
     * Check if running in production environment.
     */
    private function isProduction(): bool
    {
        return app()->environment('production');
    }

    /**
     * Confirm the operation in production.
     */
    private function confirmProduction(): bool
    {
        if ($this->option('force')) {
            return true;
        }

        return confirm(
            label: 'You are running in production. Are you sure you want to continue?',
            default: false,
            hint: 'This will reset all data in the database.'
        );
    }

    /**
     * Determine if seeders should run.
     */
    private function shouldSeed(): bool
    {
        return $this->option('seed')
            || (! $this->isProduction() && ! $this->option('no-interaction'));
    }

    /**
     * Run database setup (drop tables if fresh).
     */
    private function runDatabaseSetup(): bool
    {
        if (! $this->option('fresh')) {
            return true;
        }

        return spin(
            callback: function (): bool {
                $this->cleanupTempTables();

                return $this->callSilently('db:wipe', ['--force' => true]) === 0;
            },
            message: 'Dropping all tables...'
        );
    }

    /**
     * Clean up any leftover temporary tables from failed migrations.
     */
    private function cleanupTempTables(): void
    {
        if (config('database.default') !== 'sqlite') {
            return;
        }

        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '__temp__%'");

        foreach ($tables as $table) {
            DB::statement("DROP TABLE IF EXISTS \"{$table->name}\"");
        }
    }

    /**
     * Run the world:install command.
     */
    private function runWorldInstall(): bool
    {
        // Increase memory limit for world:install which loads large datasets
        ini_set('memory_limit', '512M');

        return spin(
            callback: fn (): bool => $this->callSilently('world:install') === 0,
            message: 'Installing world data (countries, timezones, languages)...'
        );
    }

    /**
     * Run database migrations.
     */
    private function runMigrations(): bool
    {
        return spin(
            callback: fn (): bool => $this->callSilently('migrate', ['--force' => true]) === 0,
            message: 'Running database migrations...'
        );
    }

    /**
     * Run database seeders.
     */
    private function runSeeders(): bool
    {
        return spin(
            callback: fn (): bool => $this->callSilently('db:seed', ['--force' => true]) === 0,
            message: 'Seeding database...'
        );
    }

    /**
     * Clear application caches.
     */
    private function clearCaches(): void
    {
        spin(
            callback: fn () => $this->callSilently('optimize:clear'),
            message: 'Clearing caches...'
        );
    }
}
