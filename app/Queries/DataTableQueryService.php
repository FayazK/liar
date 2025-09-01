<?php

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class DataTableQueryService
{
    protected Builder $query;
    protected Request $request;

    /**
     * Columns that can be searched globally.
     *
     * @var array
     */
    protected array $searchableColumns = [];

    /**
     * Columns that can be filtered, with optional custom filter methods.
     *
     * @var array
     */
    protected array $filterableColumns = [];

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
        if ($search = $this->request->get('search')) {
            $this->query->where(function (Builder $q) use ($search) {
                foreach ($this->searchableColumns as $column) {
                    $q->orWhere($column, 'LIKE', "%{$search}%");
                }
            });
        }
    }

    protected function applyFilters(): void
    {
        foreach ($this->filterableColumns as $column => $method) {
            // Handle both simple array values and associative definitions
            $filterColumn = is_string($column) ? $column : $method;

            if ($this->request->has($filterColumn)) {
                $value = $this->request->get($filterColumn);

                // If a custom filter method is defined (e.g., 'created_at' => 'applyDateRangeFilter')
                if (is_string($column) && method_exists($this, $method)) {
                    $this->{$method}($this->query, $value);
                }
                // Default behavior for simple filters
                else {
                    $this->applyDefaultFilter($this->query, $filterColumn, $value);
                }
            }
        }
    }

    protected function applyDefaultFilter(Builder $query, string $column, $value): void
    {
        // Handle boolean values that might come as strings
        if (in_array($value, ['true', 'false'])) {
            $query->where($column, filter_var($value, FILTER_VALIDATE_BOOLEAN));
            return;
        }
        
        $query->where($column, $value);
    }
    
    protected function applySorting(): void
    {
        $sortBy = $this->request->get('sort_by', 'created_at');
        $sortDirection = $this->request->get('sort_direction', 'desc');

        if ($sortBy) {
            $this->query->orderBy($sortBy, $sortDirection);
        }
    }

    protected function paginateResults(): LengthAwarePaginator
    {
        $perPage = (int) $this->request->get('per_page', 15);
        return $this->query->paginate($perPage);
    }
}
