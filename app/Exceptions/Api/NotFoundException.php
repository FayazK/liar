<?php

declare(strict_types=1);

namespace App\Exceptions\Api;

use App\Exceptions\ApiException;

class NotFoundException extends ApiException
{
    #[\Override]
    public function getStatusCode(): int
    {
        return 404;
    }

    #[\Override]
    public function getTitle(): string
    {
        return 'Not Found';
    }
}
