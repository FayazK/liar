<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;

describe('API Login', function () {
    it('allows login with valid credentials', function () {
        $role = Role::factory()->create();
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['id', 'email', 'first_name', 'last_name'],
                    'abilities',
                ],
                'message',
            ]);

        expect($response->json('data.token_type'))->toBe('Bearer');
    });

    it('rejects login with invalid credentials', function () {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertUnauthorized()
            ->assertJsonStructure(['errors']);
    });

    it('rejects login for inactive user', function () {
        $role = Role::factory()->create();
        User::factory()->create([
            'email' => 'inactive@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive@example.com',
            'password' => 'password123',
        ]);

        $response->assertForbidden();
    });

    it('validates required fields', function () {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertUnprocessable()
            ->assertJsonStructure(['errors']);
    });
});
