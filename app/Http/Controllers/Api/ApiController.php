<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Http\Traits\HandlesApiErrors;
use Illuminate\Http\Request;

abstract class ApiController extends Controller
{
    use ApiResponse, HandlesApiErrors;

    /**
     * Get the number of items per page from the request.
     */
    protected function getPerPage(Request $request): int
    {
        $perPage = (int) $request->query('per_page', config('api.pagination.default_per_page'));
        $maxPerPage = config('api.pagination.max_per_page');

        return min($perPage, $maxPerPage);
    }

    /**
     * Get the maximum items per page allowed.
     */
    protected function maxPerPage(): int
    {
        return config('api.pagination.max_per_page');
    }
}
