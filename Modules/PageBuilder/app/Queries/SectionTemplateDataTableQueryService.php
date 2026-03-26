<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Queries;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Definitions\SortDefinition;
use App\DataTable\Enums\FilterType;
use App\Queries\DataTableQueryService;

final class SectionTemplateDataTableQueryService extends DataTableQueryService
{
    #[\Override]
    protected function defineFilters(): array
    {
        return [
            new FilterDefinition(name: 'category', type: FilterType::Select, label: 'Category'),
            new FilterDefinition(name: 'is_active', type: FilterType::Boolean, label: 'Status'),
            new FilterDefinition(name: 'is_custom', type: FilterType::Boolean, label: 'Type'),
        ];
    }

    #[\Override]
    protected function defineSearchable(): array
    {
        return [
            new SearchDefinition(column: 'name', weight: 3),
            new SearchDefinition(column: 'category', weight: 2),
        ];
    }

    #[\Override]
    protected function defineSortable(): array
    {
        return [
            new SortDefinition(name: 'id'),
            new SortDefinition(name: 'name'),
            new SortDefinition(name: 'category'),
            new SortDefinition(name: 'sort_order'),
            new SortDefinition(name: 'is_active'),
            new SortDefinition(name: 'is_custom'),
            new SortDefinition(name: 'created_at'),
        ];
    }

    #[\Override]
    protected function getDefaultSortColumn(): string
    {
        return 'sort_order';
    }
}
