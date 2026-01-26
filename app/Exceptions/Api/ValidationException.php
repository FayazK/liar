<?php

declare(strict_types=1);

namespace App\Exceptions\Api;

use App\Exceptions\ApiException;

class ValidationException extends ApiException
{
    #[\Override]
    public function getStatusCode(): int
    {
        return 422;
    }

    #[\Override]
    public function getTitle(): string
    {
        return 'Validation Error';
    }
}
