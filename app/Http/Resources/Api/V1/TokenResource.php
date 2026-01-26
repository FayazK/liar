<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1;

use App\Http\Resources\Api\ApiResource;
use Illuminate\Http\Request;

class TokenResource extends ApiResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'token' => $this->resource['token'],
            'token_type' => 'Bearer',
            'expires_in' => $this->resource['expires_in'] ?? null,
            'user' => UserResource::make($this->resource['user']),
            'abilities' => $this->resource['abilities'] ?? [],
        ];
    }
}
