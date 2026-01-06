<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles boolean filter operations with type coercion.
 */
final class BooleanFilter implements FilterInterface
{
    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        $boolValue = $this->coerceToBoolean($value);

        if ($boolValue === null) {
            return;
        }

        $query->where($column, $boolValue);
    }

    /**
     * Coerce various value types to boolean.
     */
    private function coerceToBoolean(mixed $value): ?bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $lower = strtolower($value);

            if (in_array($lower, ['true', '1', 'yes', 'on'], true)) {
                return true;
            }

            if (in_array($lower, ['false', '0', 'no', 'off'], true)) {
                return false;
            }
        }

        if (is_numeric($value)) {
            return (bool) $value;
        }

        return null;
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::Equals->value,
        ];
    }
}
