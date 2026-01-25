<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\DataTable\Definitions\FilterDefinition;
use App\DataTable\Enums\FilterType;
use App\Http\Requests\DataTableRequest;

final class UserDataTableRequest extends DataTableRequest
{
    /**
     * @return array<int, string>
     */
    #[\Override]
    protected function getSortableColumns(): array
    {
        return [
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
    }

    /**
     * @return array<FilterDefinition>
     */
    #[\Override]
    protected function getFilterDefinitions(): array
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
}
