<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\DataTableRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class UserDataTableRequest extends DataTableRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    #[\Override]
    protected function getFilterRules(): array
    {
        return [
            'is_active' => ['nullable'],
            'created_at' => ['nullable'],
        ];
    }
}
