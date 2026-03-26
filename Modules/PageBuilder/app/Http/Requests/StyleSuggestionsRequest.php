<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StyleSuggestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'html' => ['required', 'string'],
            'css' => ['nullable', 'string'],
        ];
    }
}
