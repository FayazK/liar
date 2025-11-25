<?php

declare(strict_types=1);

namespace App\Queries;

use DateTimeImmutable;
use Illuminate\Database\Eloquent\Builder;

class UserDataTableQueryService extends DataTableQueryService
{
    /**
     * @var array<int, string>
     */
    protected array $searchableColumns = [
        'full_name',
        'email',
        'phone',
    ];

    /**
     * @var array<int|string, string>
     */
    protected array $filterableColumns = [
        'is_active',
        'created_at' => 'applyDateRangeFilter',
    ];

    /**
     * @var array<int, string>
     */
    protected array $sortableColumns = [
        'id',
        'first_name',
        'last_name',
        'full_name',
        'email',
        'phone',
        'is_active',
        'created_at',
        'last_login_at',
    ];

    /**
     * Custom filter for a date range.
     * The frontend sends this as a JSON-encoded array of two dates.
     */
    protected function applyDateRangeFilter(Builder $query, mixed $value): void
    {
        // Handle array input (from JSON request body)
        if (is_array($value)) {
            $dates = $value;
        } elseif (is_string($value)) {
            // PHP 8.3: Validate JSON before decoding
            if (! json_validate($value)) {
                return;
            }

            $dates = json_decode($value, true);
        } else {
            return;
        }

        if (! is_array($dates) || count($dates) !== 2) {
            return;
        }

        [$startDate, $endDate] = $dates;

        // Validate both dates are present and valid
        if (! $this->isValidDate($startDate) || ! $this->isValidDate($endDate)) {
            return;
        }

        $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Validate that a value is a valid date string in Y-m-d format.
     */
    private function isValidDate(mixed $date): bool
    {
        if (! is_string($date) || $date === '') {
            return false;
        }

        $parsed = DateTimeImmutable::createFromFormat('Y-m-d', $date);

        return $parsed !== false && $parsed->format('Y-m-d') === $date;
    }
}
