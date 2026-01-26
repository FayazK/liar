<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

abstract class ApiResource extends JsonResource
{
    /**
     * Wrap the resource in a 'data' key.
     *
     * @var string|null
     */
    public static $wrap = 'data';

    /**
     * Format a date to ISO 8601.
     */
    protected function formatDate(?\DateTimeInterface $date): ?string
    {
        return $date?->format('c');
    }

    /**
     * Add pagination metadata to the response.
     */
    protected function paginationMeta(array $paginated): array
    {
        return [
            'current_page' => $paginated['current_page'],
            'from' => $paginated['from'],
            'last_page' => $paginated['last_page'],
            'per_page' => $paginated['per_page'],
            'to' => $paginated['to'],
            'total' => $paginated['total'],
        ];
    }
}
