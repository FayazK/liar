<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles IS NULL and IS NOT NULL filter operations.
 */
final class NullFilter implements FilterInterface
{
    public function __construct(
        private readonly FilterOperator $operator,
    ) {}

    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        match ($this->operator) {
            FilterOperator::IsNull => $query->whereNull($column),
            FilterOperator::IsNotNull => $query->whereNotNull($column),
            default => null,
        };
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::IsNull->value,
            FilterOperator::IsNotNull->value,
        ];
    }
}
