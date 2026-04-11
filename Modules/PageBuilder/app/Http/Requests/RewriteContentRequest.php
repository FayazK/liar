<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RewriteContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'original_text' => ['required', 'string', 'max:10000'],
            'instruction' => ['required', 'string', 'max:500'],
        ];
    }
}
