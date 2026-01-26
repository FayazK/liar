<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Sanctum\PersonalAccessToken;

class TokenService
{
    /**
     * Create a new token for the user with their permissions.
     */
    public function createToken(User $user, string $deviceName = 'api'): NewAccessToken
    {
        // Get user's permissions as abilities
        $abilities = $this->getUserAbilities($user);

        // Create token with abilities
        return $user->createToken($deviceName, $abilities);
    }

    /**
     * Refresh a user's token by revoking old ones and creating a new one.
     */
    public function refreshToken(User $user, string $deviceName = 'api'): NewAccessToken
    {
        // Revoke all existing tokens for this device
        $user->tokens()->where('name', $deviceName)->delete();

        // Create new token
        return $this->createToken($user, $deviceName);
    }

    /**
     * Revoke all tokens for a user.
     */
    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Revoke a specific token for a user.
     */
    public function revokeToken(User $user, int $tokenId): bool
    {
        return $user->tokens()->where('id', $tokenId)->delete() > 0;
    }

    /**
     * Get all active tokens for a user.
     */
    public function getActiveTokens(User $user): Collection
    {
        return $user->tokens;
    }

    /**
     * Get user's permissions as token abilities.
     */
    protected function getUserAbilities(User $user): array
    {
        // Get all permissions from user's role
        $permissions = $user->getPermissions();

        // Convert permissions to abilities array
        return $permissions->pluck('key')->toArray();
    }

    /**
     * Find a token by its plain text value.
     */
    public function findToken(string $token): ?PersonalAccessToken
    {
        return PersonalAccessToken::findToken($token);
    }
}
