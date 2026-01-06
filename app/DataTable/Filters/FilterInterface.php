<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use Illuminate\Database\Eloquent\Builder;

/**
 * Contract for filter implementations.
 */
interface FilterInterface
{
    /**
     * Apply the filter to the query builder.
     */
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void;

    /**
     * Get the operators this filter supports.
     *
     * @return array<string>
     */
    public function getSupportedOperators(): array;
}
