<?php

declare(strict_types=1);

namespace App\Queries;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Definitions\SortDefinition;
use App\DataTable\Enums\FilterType;

final class RoleDataTableQueryService extends DataTableQueryService
{
    #[\Override]
    protected function defineFilters(): array
    {
        return [
            new FilterDefinition(name: 'created_at', type: FilterType::DateRange, label: 'Created Date'),
        ];
    }

    #[\Override]
    protected function defineSearchable(): array
    {
        return [
            new SearchDefinition(column: 'name', weight: 3),
            new SearchDefinition(column: 'description', weight: 2),
        ];
    }

    #[\Override]
    protected function defineSortable(): array
    {
        return [
            new SortDefinition(name: 'id'),
            new SortDefinition(name: 'name'),
            new SortDefinition(name: 'description'),
            new SortDefinition(name: 'created_at'),
            new SortDefinition(name: 'updated_at'),
            new SortDefinition(name: 'users_count', relationship: 'users', aggregate: 'count'),
            new SortDefinition(name: 'permissions_count', relationship: 'permissions', aggregate: 'count'),
        ];
    }

    #[\Override]
    protected function getDefaultSortColumn(): string
    {
        return 'name';
    }

    #[\Override]
    protected function applySorting(): void
    {
        $sorts = $this->getSortsFromRequest();

        if (empty($sorts)) {
            // Apply default sort (name ascending for roles)
            $this->query->orderBy($this->getDefaultSortColumn(), 'asc');

            return;
        }

        $sortDefinitions = $this->getSortDefinitionsMap();

        foreach ($sorts as $sort) {
            $column = $sort['column'] ?? null;
            $direction = $this->validateSortDirection($sort['direction'] ?? 'asc');

            if ($column === null || ! isset($sortDefinitions[$column])) {
                continue;
            }

            $definition = $sortDefinitions[$column];
            $this->applySortDefinition($definition, $direction);
        }
    }
}
