<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterType;
use App\Http\Requests\DataTableRequest;

final class SectionTemplateDataTableRequest extends DataTableRequest
{
    #[\Override]
    protected function getSortableColumns(): array
    {
        return ['id', 'name', 'category', 'sort_order', 'is_active', 'is_custom', 'created_at'];
    }

    #[\Override]
    protected function getFilterDefinitions(): array
    {
        return [
            new FilterDefinition(name: 'category', type: FilterType::Select, label: 'Category'),
            new FilterDefinition(name: 'is_active', type: FilterType::Boolean, label: 'Status'),
            new FilterDefinition(name: 'is_custom', type: FilterType::Boolean, label: 'Type'),
        ];
    }
}
