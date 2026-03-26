<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'prompt' => ['required', 'string', 'max:5000'],
            'section_count' => ['nullable', 'integer', 'min:2', 'max:8'],
        ];
    }
}
