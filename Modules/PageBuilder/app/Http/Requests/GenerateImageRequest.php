<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'prompt' => ['required', 'string', 'max:1000'],
            'aspect' => ['nullable', 'in:landscape,portrait,square'],
        ];
    }
}
