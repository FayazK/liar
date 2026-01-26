<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterType;
use App\Http\Requests\DataTableRequest;

final class RoleDataTableRequest extends DataTableRequest
{
    #[\Override]
    protected function getSortableColumns(): array
    {
        return ['id', 'name', 'description', 'created_at', 'updated_at', 'users_count', 'permissions_count'];
    }

    #[\Override]
    protected function getFilterDefinitions(): array
    {
        return [
            new FilterDefinition(name: 'created_at', type: FilterType::DateRange, label: 'Created Date'),
        ];
    }
}
