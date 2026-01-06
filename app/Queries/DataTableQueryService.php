<?php

declare(strict_types=1);

namespace App\Queries;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Definitions\SortDefinition;
use App\DataTable\Filters\FilterRegistry;
use App\DataTable\Search\SearchEngine;
use App\DataTable\Support\RelationshipHandler;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Abstract service for DataTable queries with filtering, searching, and sorting.
 */
abstract class DataTableQueryService
{
    private const int DEFAULT_PER_PAGE = 15;

    private const int MAX_PER_PAGE = 100;

    private const string DEFAULT_SORT_DIRECTION = 'desc';

    protected Builder $query;

    protected Request $request;

    protected FilterRegistry $filterRegistry;

    protected SearchEngine $searchEngine;

    protected RelationshipHandler $relationshipHandler;

    public function __construct(Builder $query, Request $request)
    {
        $this->query = $query;
        $this->request = $request;

        // Resolve dependencies from container
        $this->filterRegistry = app(FilterRegistry::class);
        $this->searchEngine = app(SearchEngine::class);
        $this->relationshipHandler = app(RelationshipHandler::class);
    }

    /**
     * Define filter configurations for this table.
     *
     * @return array<FilterDefinition>
     */
    abstract protected function defineFilters(): array;

    /**
     * Define searchable columns for this table.
     *
     * @return array<SearchDefinition>
     */
    abstract protected function defineSearchable(): array;

    /**
     * Define sortable columns for this table.
     *
     * @return array<SortDefinition>
     */
    abstract protected function defineSortable(): array;

    /**
     * Get the default sort column.
     */
    protected function getDefaultSortColumn(): string
    {
        return 'created_at';
    }

    /**
     * Get paginated results.
     */
    public function getResults(): LengthAwarePaginator
    {
        $this->applySearching();
        $this->applyFilters();
        $this->applySorting();

        return $this->paginateResults();
    }

    /**
     * Apply search filters to the query.
     */
    protected function applySearching(): void
    {
        $search = $this->request->get('search');

        if (! is_string($search) || $search === '') {
            return;
        }

        $this->searchEngine->apply($this->query, $search, $this->defineSearchable());
    }

    /**
     * Apply filters to the query.
     */
    protected function applyFilters(): void
    {
        $filters = $this->getFiltersFromRequest();
        $definitions = $this->defineFilters();

        foreach ($definitions as $definition) {
            $filterValue = $filters[$definition->name] ?? null;

            if ($filterValue === null || $filterValue === '') {
                continue;
            }

            $this->filterRegistry->apply($this->query, $definition, $filterValue);
        }
    }

    /**
     * Get filters from the request.
     *
     * @return array<string, mixed>
     */
    protected function getFiltersFromRequest(): array
    {
        // Support both nested 'filters' object and flat params
        $filters = $this->request->get('filters');

        // Handle JSON-encoded filters string
        if (is_string($filters)) {
            $decoded = json_decode($filters, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        if (is_array($filters)) {
            return $filters;
        }

        // Fall back to individual filter params
        $result = [];
        foreach ($this->defineFilters() as $definition) {
            $value = $this->request->get($definition->name);
            if ($value !== null) {
                $result[$definition->name] = $value;
            }
        }

        return $result;
    }

    /**
     * Apply sorting to the query.
     */
    protected function applySorting(): void
    {
        $sorts = $this->getSortsFromRequest();

        if (empty($sorts)) {
            // Apply default sort
            $this->query->orderBy($this->getDefaultSortColumn(), self::DEFAULT_SORT_DIRECTION);

            return;
        }

        $sortDefinitions = $this->getSortDefinitionsMap();

        foreach ($sorts as $sort) {
            $column = $sort['column'] ?? null;
            $direction = $this->validateSortDirection($sort['direction'] ?? 'asc');

            if ($column === null || ! isset($sortDefinitions[$column])) {
                continue;
            }

            $definition = $sortDefinitions[$column];
            $this->applySortDefinition($definition, $direction);
        }
    }

    /**
     * Get sort requests from the request.
     *
     * @return array<array{column: string, direction: string}>
     */
    protected function getSortsFromRequest(): array
    {
        // Support new 'sorts' array format
        $sorts = $this->request->get('sorts');

        if (is_array($sorts) && ! empty($sorts)) {
            return $sorts;
        }

        // Support legacy single sort format
        $sortBy = $this->request->get('sort_by');
        $sortDirection = $this->request->get('sort_direction', 'asc');

        if (is_string($sortBy) && $sortBy !== '') {
            return [['column' => $sortBy, 'direction' => $sortDirection]];
        }

        return [];
    }

    /**
     * Get sort definitions as a map keyed by name.
     *
     * @return array<string, SortDefinition>
     */
    protected function getSortDefinitionsMap(): array
    {
        $map = [];
        foreach ($this->defineSortable() as $definition) {
            $map[$definition->name] = $definition;
        }

        return $map;
    }

    /**
     * Apply a single sort definition to the query.
     */
    protected function applySortDefinition(SortDefinition $definition, string $direction): void
    {
        // Custom sort callback
        if ($definition->hasCustomSort()) {
            ($definition->customSort)($this->query, $direction);

            return;
        }

        // Aggregate sort
        if ($definition->hasAggregate()) {
            $this->applyAggregateSort($definition, $direction);

            return;
        }

        // Relationship sort
        if ($definition->hasRelationship()) {
            $column = $this->relationshipHandler->applyJoinAndGetColumn(
                $this->query,
                $definition->getColumn(),
                $definition->relationship
            );
            $this->query->orderBy($column, $direction);

            return;
        }

        // Simple column sort
        $this->query->orderBy($definition->getColumn(), $direction);
    }

    /**
     * Apply aggregate sorting (count, sum, avg, etc.).
     */
    protected function applyAggregateSort(SortDefinition $definition, string $direction): void
    {
        if (! $definition->hasRelationship() || ! $definition->hasAggregate()) {
            return;
        }

        $relationship = $definition->relationship;
        $aggregate = $definition->aggregate;
        $column = $definition->getColumn();
        $alias = "{$relationship}_{$aggregate}_{$column}";

        $this->query->withCount([
            "{$relationship} as {$alias}" => function (Builder $query) use ($aggregate, $column): void {
                if ($aggregate !== 'count') {
                    $query->select(\DB::raw("{$aggregate}({$column})"));
                }
            },
        ]);

        $this->query->orderBy($alias, $direction);
    }

    /**
     * Validate and normalize sort direction.
     */
    protected function validateSortDirection(string $direction): string
    {
        $direction = strtolower($direction);

        return in_array($direction, ['asc', 'desc'], true) ? $direction : 'asc';
    }

    /**
     * Paginate the results.
     */
    protected function paginateResults(): LengthAwarePaginator
    {
        $perPage = (int) $this->request->get('per_page', self::DEFAULT_PER_PAGE);
        $perPage = min(max($perPage, 1), self::MAX_PER_PAGE);

        return $this->query->paginate($perPage);
    }

    /**
     * Get filter metadata for frontend consumption.
     *
     * @return array<array<string, mixed>>
     */
    public function getFilterMetadata(): array
    {
        return array_map(
            fn (FilterDefinition $def) => $def->toArray(),
            $this->defineFilters()
        );
    }

    /**
     * Get searchable metadata for frontend consumption.
     *
     * @return array<array<string, mixed>>
     */
    public function getSearchableMetadata(): array
    {
        return array_map(
            fn (SearchDefinition $def) => $def->toArray(),
            $this->defineSearchable()
        );
    }

    /**
     * Get sortable metadata for frontend consumption.
     *
     * @return array<array<string, mixed>>
     */
    public function getSortableMetadata(): array
    {
        return array_map(
            fn (SortDefinition $def) => $def->toArray(),
            $this->defineSortable()
        );
    }
}
