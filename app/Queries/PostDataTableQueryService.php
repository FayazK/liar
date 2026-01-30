<?php

declare(strict_types=1);

namespace App\Queries;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Definitions\SearchDefinition;
use App\DataTable\Definitions\SortDefinition;
use App\DataTable\Enums\FilterType;
use App\Enums\PostStatus;

final class PostDataTableQueryService extends DataTableQueryService
{
    #[\Override]
    protected function defineFilters(): array
    {
        return [
            new FilterDefinition(
                name: 'status',
                type: FilterType::Select,
                label: 'Status',
                options: collect(PostStatus::cases())->map(fn ($status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])->toArray()
            ),
            new FilterDefinition(
                name: 'author_id',
                type: FilterType::Select,
                label: 'Author'
            ),
            new FilterDefinition(
                name: 'created_at',
                type: FilterType::DateRange,
                label: 'Created Date'
            ),
            new FilterDefinition(
                name: 'published_at',
                type: FilterType::DateRange,
                label: 'Published Date'
            ),
        ];
    }

    #[\Override]
    protected function defineSearchable(): array
    {
        return [
            new SearchDefinition(column: 'title', weight: 4),
            new SearchDefinition(column: 'slug', weight: 2),
            new SearchDefinition(column: 'excerpt', weight: 1),
        ];
    }

    #[\Override]
    protected function defineSortable(): array
    {
        return [
            new SortDefinition(name: 'id'),
            new SortDefinition(name: 'title'),
            new SortDefinition(name: 'slug'),
            new SortDefinition(name: 'status'),
            new SortDefinition(name: 'author_name', column: 'first_name', relationship: 'author'),
            new SortDefinition(name: 'published_at'),
            new SortDefinition(name: 'created_at'),
            new SortDefinition(name: 'updated_at'),
        ];
    }

    #[\Override]
    protected function getDefaultSortColumn(): string
    {
        return 'created_at';
    }
}
