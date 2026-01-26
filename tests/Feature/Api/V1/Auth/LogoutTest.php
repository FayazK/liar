<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('API Logout', function () {
    it('allows authenticated user to logout', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create(['role_id' => $role->id]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertOk()
            ->assertJson(['message' => 'Logout successful']);

        expect($user->tokens()->count())->toBe(0);
    });

    it('requires authentication', function () {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertUnauthorized();
    });
});
