<?php

declare(strict_types=1);

namespace App\Exceptions\Api;

use App\Exceptions\ApiException;

class ForbiddenException extends ApiException
{
    #[\Override]
    public function getStatusCode(): int
    {
        return 403;
    }

    #[\Override]
    public function getTitle(): string
    {
        return 'Forbidden';
    }
}
