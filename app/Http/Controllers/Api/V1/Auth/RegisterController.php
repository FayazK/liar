<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\Api\V1\TokenResource;
use App\Services\TokenService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class RegisterController extends ApiController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly TokenService $tokenService
    ) {}

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Create user
        $user = $this->userService->createUser($request->validated());

        // Create token
        $deviceName = $request->input('device_name', 'api');
        $token = $this->tokenService->createToken($user, $deviceName);

        return $this->created(
            TokenResource::make([
                'token' => $token->plainTextToken,
                'expires_in' => config('api.token.expiration'),
                'user' => $user->load('role'),
                'abilities' => $token->accessToken->abilities,
            ]),
            'Registration successful'
        );
    }
}
