<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'prompt' => ['required', 'string', 'max:2000'],
            'category' => ['nullable', 'string', 'max:50'],
        ];
    }
}
