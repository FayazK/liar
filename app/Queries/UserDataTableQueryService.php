<?php

namespace App\Queries;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class UserDataTableQueryService extends DataTableQueryService
{
    /**
     * @var array
     */
    protected array $searchableColumns = [
        'full_name',
        'email',
        'phone',
    ];

    /**
     * @var array
     */
    protected array $filterableColumns = [
        'is_active',
        'created_at' => 'applyDateRangeFilter',
    ];

    /**
     * Custom filter for a date range.
     * The frontend sends this as a JSON-encoded array of two dates.
     *
     * @param Builder $query
     * @param mixed $value
     * @return void
     */
    protected function applyDateRangeFilter(Builder $query, $value): void
    {
        // The value from the request might be a JSON string array '["2025-08-01", "2025-08-31"]'
        // or an array if the request body was JSON.
        $dates = is_string($value) ? json_decode($value, true) : $value;

        if (is_array($dates) && count($dates) === 2) {
            // Basic validation
            if (!empty($dates[0]) && !empty($dates[1])) {
                $query->whereBetween('created_at', [$dates[0], $dates[1]]);
            }
        }
    }
}
