<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;
use App\Services\TokenService;

beforeEach(function () {
    $this->tokenService = new TokenService;
});

describe('TokenService', function () {
    it('creates a token with user permissions', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $token = $this->tokenService->createToken($user, 'test-device');

        expect($token)->toBeInstanceOf(Laravel\Sanctum\NewAccessToken::class);
        expect($user->tokens()->count())->toBe(1);
        expect($user->tokens()->first()->name)->toBe('test-device');
    });

    it('refreshes a token by revoking old and creating new', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        // Create initial token
        $oldToken = $this->tokenService->createToken($user, 'test-device');
        $oldTokenId = $user->tokens()->first()->id;

        // Refresh token
        $newToken = $this->tokenService->refreshToken($user, 'test-device');

        expect($user->tokens()->count())->toBe(1);
        expect($user->tokens()->first()->id)->not->toBe($oldTokenId);
    });

    it('revokes all tokens for a user', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->tokenService->createToken($user, 'device-1');
        $this->tokenService->createToken($user, 'device-2');

        expect($user->tokens()->count())->toBe(2);

        $this->tokenService->revokeAllTokens($user);

        expect($user->tokens()->count())->toBe(0);
    });

    it('revokes a specific token', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->tokenService->createToken($user, 'device-1');
        $this->tokenService->createToken($user, 'device-2');

        $tokenToRevoke = $user->tokens()->first();

        $result = $this->tokenService->revokeToken($user, $tokenToRevoke->id);

        expect($result)->toBeTrue();
        expect($user->tokens()->count())->toBe(1);
    });

    it('gets all active tokens for a user', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->tokenService->createToken($user, 'device-1');
        $this->tokenService->createToken($user, 'device-2');

        $tokens = $this->tokenService->getActiveTokens($user);

        expect($tokens)->toHaveCount(2);
    });
});
