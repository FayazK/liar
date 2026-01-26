<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Sanctum\PersonalAccessToken;

class TokenRepository
{
    /**
     * Find a token by its plain text value.
     */
    public function findByToken(string $token): ?PersonalAccessToken
    {
        return PersonalAccessToken::findToken($token);
    }

    /**
     * Get all tokens for a user.
     */
    public function getUserTokens(User $user): Collection
    {
        return $user->tokens;
    }

    /**
     * Delete a specific token by ID.
     */
    public function deleteToken(int $tokenId): bool
    {
        return PersonalAccessToken::where('id', $tokenId)->delete() > 0;
    }

    /**
     * Delete all tokens for a user.
     */
    public function deleteUserTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Delete tokens by device name for a user.
     */
    public function deleteTokensByDevice(User $user, string $deviceName): void
    {
        $user->tokens()->where('name', $deviceName)->delete();
    }
}
