<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'business_name' => ['required', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'tone_of_voice' => ['required', 'in:professional,casual,playful,authoritative,friendly'],
            'target_audience' => ['nullable', 'string', 'max:2000'],
            'color_palette' => ['nullable', 'array'],
            'color_palette.primary' => ['nullable', 'string', 'max:7'],
            'color_palette.secondary' => ['nullable', 'string', 'max:7'],
            'color_palette.accent' => ['nullable', 'string', 'max:7'],
            'font_preferences' => ['nullable', 'array'],
            'font_preferences.heading' => ['nullable', 'string', 'max:100'],
            'font_preferences.body' => ['nullable', 'string', 'max:100'],
            'brand_description' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
