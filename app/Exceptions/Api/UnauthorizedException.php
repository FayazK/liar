<?php

declare(strict_types=1);

namespace App\Exceptions\Api;

use App\Exceptions\ApiException;

class UnauthorizedException extends ApiException
{
    #[\Override]
    public function getStatusCode(): int
    {
        return 401;
    }

    #[\Override]
    public function getTitle(): string
    {
        return 'Unauthorized';
    }
}
