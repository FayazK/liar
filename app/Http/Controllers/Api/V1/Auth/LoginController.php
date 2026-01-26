<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\Api\V1\TokenResource;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoginController extends ApiController
{
    public function __construct(
        private readonly TokenService $tokenService
    ) {}

    /**
     * Login with email and password.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials)) {
            return $this->unauthorized('Invalid credentials');
        }

        $user = Auth::user();

        // Check if user is active
        if (! $user->is_active) {
            return $this->forbidden('Account is inactive');
        }

        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Create token with user's permissions
        $deviceName = $request->input('device_name', 'api');
        $token = $this->tokenService->createToken($user, $deviceName);

        return $this->success(
            TokenResource::make([
                'token' => $token->plainTextToken,
                'expires_in' => config('api.token.expiration'),
                'user' => $user->load('role'),
                'abilities' => $token->accessToken->abilities,
            ]),
            'Login successful'
        );
    }
}
