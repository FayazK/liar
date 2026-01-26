<?php

declare(strict_types=1);

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     */
    protected function success(
        JsonResource|ResourceCollection|array $data,
        string $message = '',
        int $status = 200
    ): JsonResponse {
        $response = ['data' => $data];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }

    /**
     * Return a created (201) JSON response.
     */
    protected function created(
        JsonResource|array $data,
        string $message = 'Resource created successfully'
    ): JsonResponse {
        return $this->success($data, $message, 201);
    }

    /**
     * Return a no content (204) response.
     */
    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * Return an error JSON response in JSON:API format.
     */
    protected function error(
        string $title,
        string $detail = '',
        int $status = 400,
        ?string $source = null
    ): JsonResponse {
        $error = [
            'status' => (string) $status,
            'title' => $title,
        ];

        if ($detail) {
            $error['detail'] = $detail;
        }

        if ($source) {
            $error['source'] = ['pointer' => $source];
        }

        return response()->json(['errors' => [$error]], $status);
    }

    /**
     * Return a not found (404) error response.
     */
    protected function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return $this->error('Not Found', $message, 404);
    }

    /**
     * Return a forbidden (403) error response.
     */
    protected function forbidden(string $message = 'Access forbidden'): JsonResponse
    {
        return $this->error('Forbidden', $message, 403);
    }

    /**
     * Return an unauthorized (401) error response.
     */
    protected function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->error('Unauthorized', $message, 401);
    }

    /**
     * Return a validation error (422) response.
     */
    protected function validationError(array $errors): JsonResponse
    {
        $formattedErrors = [];

        foreach ($errors as $field => $messages) {
            foreach ((array) $messages as $message) {
                $formattedErrors[] = [
                    'status' => '422',
                    'title' => 'Validation Error',
                    'detail' => $message,
                    'source' => ['pointer' => "/data/attributes/{$field}"],
                ];
            }
        }

        return response()->json(['errors' => $formattedErrors], 422);
    }
}
