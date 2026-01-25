<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles text search filter operations (contains, starts_with, ends_with).
 */
final class TextFilter implements FilterInterface
{
    public function __construct(
        private readonly FilterOperator $operator,
    ) {}

    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        $searchValue = match ($this->operator) {
            FilterOperator::Contains => "%{$value}%",
            FilterOperator::StartsWith => "{$value}%",
            FilterOperator::EndsWith => "%{$value}",
            default => $value,
        };

        $query->where($column, 'LIKE', $searchValue);
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::Contains->value,
            FilterOperator::StartsWith->value,
            FilterOperator::EndsWith->value,
        ];
    }
}
