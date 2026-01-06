<?php

declare(strict_types=1);

namespace App\Http\Requests\Library;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LibraryItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'sort_by' => [
                'sometimes',
                'string',
                Rule::in(['name', 'created_at', 'updated_at', 'size', 'type', 'date']),
            ],
            'sort_dir' => [
                'sometimes',
                'string',
                Rule::in(['asc', 'desc']),
            ],
            'per_page' => [
                'sometimes',
                'integer',
                'min:1',
                'max:100',
            ],
        ];
    }
}
