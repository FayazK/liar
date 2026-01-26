<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

abstract class ApiException extends Exception
{
    /**
     * Get the status code for the exception.
     */
    abstract public function getStatusCode(): int;

    /**
     * Get the error title.
     */
    abstract public function getTitle(): string;

    /**
     * Convert the exception to a JSON:API error array.
     */
    public function toArray(): array
    {
        return [
            'status' => (string) $this->getStatusCode(),
            'title' => $this->getTitle(),
            'detail' => $this->getMessage(),
        ];
    }
}
