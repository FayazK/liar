<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiController;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoutController extends ApiController
{
    public function __construct(
        private readonly TokenService $tokenService
    ) {}

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        // Revoke all tokens
        $this->tokenService->revokeAllTokens($user);

        return $this->success([], 'Logout successful');
    }
}
