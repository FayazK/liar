<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:50'],
            'html_template' => ['sometimes', 'required', 'string'],
            'css_template' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
