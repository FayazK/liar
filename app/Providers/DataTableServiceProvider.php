<?php

declare(strict_types=1);

namespace App\Providers;

use App\DataTable\Filters\FilterRegistry;
use App\DataTable\Search\SearchEngine;
use App\DataTable\Support\RelationshipHandler;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider for DataTable components.
 */
final class DataTableServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[\Override]
    public function register(): void
    {
        $this->app->singleton(RelationshipHandler::class, function (): RelationshipHandler {
            return new RelationshipHandler;
        });

        $this->app->singleton(FilterRegistry::class, function ($app): FilterRegistry {
            return new FilterRegistry(
                $app->make(RelationshipHandler::class)
            );
        });

        $this->app->singleton(SearchEngine::class, function ($app): SearchEngine {
            return new SearchEngine(
                $app->make(RelationshipHandler::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
