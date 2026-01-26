<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\Api\V1\TokenResource;
use App\Http\Resources\Api\V1\UserResource;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokenController extends ApiController
{
    public function __construct(
        private readonly TokenService $tokenService
    ) {}

    /**
     * Refresh the user's token.
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $deviceName = $request->input('device_name', 'api');

        $token = $this->tokenService->refreshToken($user, $deviceName);

        return $this->success(
            TokenResource::make([
                'token' => $token->plainTextToken,
                'expires_in' => config('api.token.expiration'),
                'user' => $user->load('role'),
                'abilities' => $token->accessToken->abilities,
            ]),
            'Token refreshed successfully'
        );
    }

    /**
     * Get the authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load('role');

        return $this->success(
            UserResource::make($user),
            'User retrieved successfully'
        );
    }
}
