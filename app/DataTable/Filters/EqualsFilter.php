<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles equals and not equals filter operations.
 */
final class EqualsFilter implements FilterInterface
{
    public function __construct(
        private readonly FilterOperator $operator,
    ) {}

    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        $sqlOperator = $this->operator->getSqlOperator();
        $query->where($column, $sqlOperator, $value);
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::Equals->value,
            FilterOperator::NotEquals->value,
        ];
    }
}
