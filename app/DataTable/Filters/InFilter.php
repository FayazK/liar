<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles IN and NOT IN filter operations.
 */
final class InFilter implements FilterInterface
{
    public function __construct(
        private readonly FilterOperator $operator,
    ) {}

    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        if (! is_array($value)) {
            $value = [$value];
        }

        match ($this->operator) {
            FilterOperator::In => $query->whereIn($column, $value),
            FilterOperator::NotIn => $query->whereNotIn($column, $value),
            default => null,
        };
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::In->value,
            FilterOperator::NotIn->value,
        ];
    }
}
