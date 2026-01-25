<?php

declare(strict_types=1);

namespace App\Queries;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Definitions\SortDefinition;
use App\DataTable\Enums\FilterType;

/**
 * DataTable query service for Users.
 */
final class UserDataTableQueryService extends DataTableQueryService
{
    /**
     * Define filter configurations for the users table.
     *
     * @return array<FilterDefinition>
     */
    #[\Override]
    protected function defineFilters(): array
    {
        return [
            new FilterDefinition(
                name: 'is_active',
                type: FilterType::Boolean,
                label: 'Status',
            ),
            new FilterDefinition(
                name: 'created_at',
                type: FilterType::DateRange,
                label: 'Created Date',
            ),
        ];
    }

    /**
     * Define searchable columns for the users table.
     *
     * @return array<SearchDefinition>
     */
    #[\Override]
    protected function defineSearchable(): array
    {
        return [
            new SearchDefinition(column: 'first_name', weight: 2),
            new SearchDefinition(column: 'last_name', weight: 2),
            new SearchDefinition(column: 'email', weight: 3),
            new SearchDefinition(column: 'phone', weight: 1),
        ];
    }

    /**
     * Define sortable columns for the users table.
     *
     * @return array<SortDefinition>
     */
    #[\Override]
    protected function defineSortable(): array
    {
        return [
            new SortDefinition(name: 'id'),
            new SortDefinition(name: 'first_name'),
            new SortDefinition(name: 'last_name'),
            new SortDefinition(
                name: 'full_name',
                customSort: fn ($query, $direction) => $query
                    ->orderBy('first_name', $direction)
                    ->orderBy('last_name', $direction),
            ),
            new SortDefinition(name: 'email'),
            new SortDefinition(name: 'phone'),
            new SortDefinition(name: 'is_active'),
            new SortDefinition(name: 'created_at'),
            new SortDefinition(name: 'last_login_at'),
        ];
    }
}
