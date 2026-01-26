<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class ApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Override this method in child classes for specific authorization logic.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Handle a failed validation attempt in JSON:API format.
     *
     * @throws HttpResponseException
     */
    protected function failedValidation(Validator $validator): void
    {
        $errors = [];

        foreach ($validator->errors()->messages() as $field => $messages) {
            foreach ($messages as $message) {
                $errors[] = [
                    'status' => '422',
                    'title' => 'Validation Error',
                    'detail' => $message,
                    'source' => ['pointer' => "/data/attributes/{$field}"],
                ];
            }
        }

        throw new HttpResponseException(
            response()->json(['errors' => $errors], 422)
        );
    }
}
