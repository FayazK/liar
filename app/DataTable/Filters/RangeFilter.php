<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles range filter operations (gt, gte, lt, lte, between).
 */
final class RangeFilter implements FilterInterface
{
    public function __construct(
        private readonly FilterOperator $operator,
    ) {}

    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        match ($this->operator) {
            FilterOperator::Between => $this->applyBetween($query, $column, $value),
            default => $query->where($column, $this->operator->getSqlOperator(), $value),
        };
    }

    private function applyBetween(Builder $query, string $column, mixed $value): void
    {
        if (! is_array($value) || count($value) !== 2) {
            return;
        }

        [$min, $max] = $value;

        if ($min !== null && $max !== null) {
            $query->whereBetween($column, [$min, $max]);
        } elseif ($min !== null) {
            $query->where($column, '>=', $min);
        } elseif ($max !== null) {
            $query->where($column, '<=', $max);
        }
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::GreaterThan->value,
            FilterOperator::GreaterThanOrEquals->value,
            FilterOperator::LessThan->value,
            FilterOperator::LessThanOrEquals->value,
            FilterOperator::Between->value,
        ];
    }
}
