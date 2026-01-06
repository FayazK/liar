<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use App\DataTable\Enums\FilterType;
use App\DataTable\Support\RelationshipHandler;
use Illuminate\Database\Eloquent\Builder;

/**
 * Registry for filter implementations.
 * Resolves appropriate filter handler based on operator and type.
 */
final class FilterRegistry
{
    public function __construct(
        private readonly RelationshipHandler $relationshipHandler,
    ) {}

    /**
     * Apply a filter to the query.
     *
     * @param  array{operator?: string, value: mixed}|mixed  $filterValue
     */
    public function apply(Builder $query, FilterDefinition $definition, mixed $filterValue): void
    {
        // Parse filter value - can be {operator, value} or just value
        $parsed = $this->parseFilterValue($filterValue, $definition);

        if ($parsed === null) {
            return;
        }

        [$operator, $value] = $parsed;

        // Validate operator is allowed for this filter
        if (! $definition->isOperatorAllowed($operator)) {
            return;
        }

        // Get the appropriate filter implementation
        $filter = $this->resolveFilter($operator, $definition->type);

        if ($filter === null) {
            return;
        }

        // Apply relationship join if needed
        $column = $definition->getColumn();
        if ($definition->hasRelationship()) {
            $column = $this->relationshipHandler->applyJoinAndGetColumn(
                $query,
                $column,
                $definition->relationship
            );
        }

        // Apply the filter
        $filter->apply($query, $column, $value, $definition);
    }

    /**
     * Parse the filter value from the request.
     *
     * @return array{0: FilterOperator, 1: mixed}|null
     */
    private function parseFilterValue(mixed $filterValue, FilterDefinition $definition): ?array
    {
        // Handle null/empty values
        if ($filterValue === null || $filterValue === '') {
            return null;
        }

        // Handle object/array format: {operator: 'eq', value: 'test'}
        if (is_array($filterValue) && isset($filterValue['operator'])) {
            $operatorString = $filterValue['operator'];
            $operator = FilterOperator::tryFrom($operatorString);

            if ($operator === null) {
                return null;
            }

            // For null checks, value is not required
            if (! $operator->requiresValue()) {
                return [$operator, null];
            }

            $value = $filterValue['value'] ?? null;
            if ($value === null || $value === '') {
                return null;
            }

            return [$operator, $value];
        }

        // Handle simple value format - use default operator based on type
        $defaultOperator = $this->getDefaultOperator($definition->type);

        return [$defaultOperator, $filterValue];
    }

    /**
     * Get the default operator for a filter type.
     */
    private function getDefaultOperator(FilterType $type): FilterOperator
    {
        return match ($type) {
            FilterType::Text => FilterOperator::Contains,
            FilterType::MultiSelect => FilterOperator::In,
            FilterType::DateRange => FilterOperator::Between,
            default => FilterOperator::Equals,
        };
    }

    /**
     * Resolve the appropriate filter implementation.
     */
    private function resolveFilter(FilterOperator $operator, FilterType $type): ?FilterInterface
    {
        // Special case for boolean type
        if ($type === FilterType::Boolean) {
            return new BooleanFilter;
        }

        // Special case for date range type
        if ($type === FilterType::DateRange) {
            return new DateRangeFilter;
        }

        return match ($operator) {
            FilterOperator::Equals, FilterOperator::NotEquals => new EqualsFilter($operator),
            FilterOperator::Contains, FilterOperator::StartsWith, FilterOperator::EndsWith => new TextFilter($operator),
            FilterOperator::GreaterThan, FilterOperator::GreaterThanOrEquals,
            FilterOperator::LessThan, FilterOperator::LessThanOrEquals,
            FilterOperator::Between => new RangeFilter($operator),
            FilterOperator::In, FilterOperator::NotIn => new InFilter($operator),
            FilterOperator::IsNull, FilterOperator::IsNotNull => new NullFilter($operator),
        };
    }

    /**
     * Get all supported operators.
     *
     * @return array<string>
     */
    public function getSupportedOperators(): array
    {
        return array_map(
            fn (FilterOperator $op) => $op->value,
            FilterOperator::cases()
        );
    }
}
