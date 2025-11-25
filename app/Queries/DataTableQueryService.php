<?php

declare(strict_types=1);

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class DataTableQueryService
{
    private const int DEFAULT_PER_PAGE = 15;

    private const int MAX_PER_PAGE = 100;

    private const int MAX_SEARCH_LENGTH = 255;

    private const string DEFAULT_SORT_COLUMN = 'created_at';

    private const string DEFAULT_SORT_DIRECTION = 'desc';

    /**
     * @var array<int, string>
     */
    private const array ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'];

    protected Builder $query;

    protected Request $request;

    /**
     * Columns that can be searched globally.
     *
     * @var array<int, string>
     */
    protected array $searchableColumns = [];

    /**
     * Columns that can be filtered, with optional custom filter methods.
     *
     * @var array<int|string, string>
     */
    protected array $filterableColumns = [];

    /**
     * Columns that are allowed for sorting.
     *
     * @var array<int, string>
     */
    protected array $sortableColumns = [];

    public function __construct(Builder $query, Request $request)
    {
        $this->query = $query;
        $this->request = $request;
    }

    public function getResults(): LengthAwarePaginator
    {
        $this->applySearching();
        $this->applyFilters();
        $this->applySorting();

        return $this->paginateResults();
    }

    protected function applySearching(): void
    {
        $search = $this->request->get('search');

        if (! is_string($search) || $search === '') {
            return;
        }

        // Limit search string length for performance and security
        $search = mb_substr($search, 0, self::MAX_SEARCH_LENGTH);

        $this->query->where(function (Builder $q) use ($search): void {
            foreach ($this->searchableColumns as $column) {
                $q->orWhere($column, 'LIKE', '%'.$search.'%');
            }
        });
    }

    protected function applyFilters(): void
    {
        foreach ($this->filterableColumns as $column => $method) {
            // Handle both simple array values and associative definitions
            $filterColumn = is_int($column) ? $method : $column;

            if (! $this->request->has($filterColumn)) {
                continue;
            }

            $value = $this->request->get($filterColumn);

            // If a custom filter method is defined (e.g., 'created_at' => 'applyDateRangeFilter')
            if (is_string($column) && method_exists($this, $method)) {
                $this->{$method}($this->query, $value);
            } else {
                // Default behavior for simple filters
                $this->applyDefaultFilter($this->query, $filterColumn, $value);
            }
        }
    }

    protected function applyDefaultFilter(Builder $query, string $column, mixed $value): void
    {
        if ($value === null || $value === '') {
            return;
        }

        // Handle boolean values that might come as strings
        if (is_string($value) && in_array(strtolower($value), ['true', 'false'], true)) {
            $query->where($column, strtolower($value) === 'true');

            return;
        }

        // Handle actual boolean values
        if (is_bool($value)) {
            $query->where($column, $value);

            return;
        }

        $query->where($column, $value);
    }

    protected function applySorting(): void
    {
        $sortBy = $this->request->get('sort_by', self::DEFAULT_SORT_COLUMN);
        $sortDirection = $this->request->get('sort_direction', self::DEFAULT_SORT_DIRECTION);

        // Validate sort column against whitelist
        if (! is_string($sortBy) || (! empty($this->sortableColumns) && ! in_array($sortBy, $this->sortableColumns, true))) {
            $sortBy = self::DEFAULT_SORT_COLUMN;
        }

        // Validate sort direction
        if (! is_string($sortDirection) || ! in_array(strtolower($sortDirection), self::ALLOWED_SORT_DIRECTIONS, true)) {
            $sortDirection = self::DEFAULT_SORT_DIRECTION;
        }

        $this->query->orderBy($sortBy, strtolower($sortDirection));
    }

    protected function paginateResults(): LengthAwarePaginator
    {
        $perPage = (int) $this->request->get('per_page', self::DEFAULT_PER_PAGE);

        // Enforce maximum per_page to prevent performance issues
        $perPage = min(max($perPage, 1), self::MAX_PER_PAGE);

        return $this->query->paginate($perPage);
    }
}
