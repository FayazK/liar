<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterType;
use App\Enums\PostStatus;
use App\Http\Requests\DataTableRequest;

final class PostDataTableRequest extends DataTableRequest
{
    #[\Override]
    protected function getSortableColumns(): array
    {
        return [
            'id',
            'title',
            'slug',
            'status',
            'author_id',
            'published_at',
            'created_at',
            'updated_at',
        ];
    }

    #[\Override]
    protected function getFilterDefinitions(): array
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
}
