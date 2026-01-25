<?php

declare(strict_types=1);

namespace App\DataTable\Filters;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterOperator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles date range filter operations.
 */
final class DateRangeFilter implements FilterInterface
{
    #[\Override]
    public function apply(Builder $query, string $column, mixed $value, FilterDefinition $definition): void
    {
        $dateRange = $this->parseDateRange($value);

        if ($dateRange === null) {
            return;
        }

        [$startDate, $endDate] = $dateRange;

        if ($startDate !== null && $endDate !== null) {
            $query->whereBetween($column, [$startDate, $endDate]);
        } elseif ($startDate !== null) {
            $query->where($column, '>=', $startDate);
        } elseif ($endDate !== null) {
            $query->where($column, '<=', $endDate);
        }
    }

    /**
     * Parse various date range formats.
     *
     * @return array{0: string|null, 1: string|null}|null
     */
    private function parseDateRange(mixed $value): ?array
    {
        // Handle JSON string input
        if (is_string($value)) {
            if (json_validate($value)) {
                $value = json_decode($value, true);
            } else {
                return null;
            }
        }

        if (! is_array($value)) {
            return null;
        }

        // Handle indexed array [start, end]
        if (isset($value[0]) || isset($value[1])) {
            return [
                $this->normalizeDate($value[0] ?? null),
                $this->normalizeDate($value[1] ?? null),
            ];
        }

        // Handle associative array {start: ..., end: ...}
        if (isset($value['start']) || isset($value['end'])) {
            return [
                $this->normalizeDate($value['start'] ?? null),
                $this->normalizeDate($value['end'] ?? null),
            ];
        }

        return null;
    }

    /**
     * Normalize a date value to string format.
     */
    private function normalizeDate(mixed $date): ?string
    {
        if ($date === null || $date === '') {
            return null;
        }

        if (is_string($date)) {
            return $date;
        }

        if ($date instanceof \DateTimeInterface) {
            return $date->format('Y-m-d');
        }

        return null;
    }

    #[\Override]
    public function getSupportedOperators(): array
    {
        return [
            FilterOperator::Between->value,
        ];
    }
}
