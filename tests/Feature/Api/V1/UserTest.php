<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('API Users', function () {
    beforeEach(function () {
        $role = Role::factory()->create();
        $this->user = User::factory()->create(['role_id' => $role->id]);
        $this->authenticatedUser = $this->user;
        Sanctum::actingAs($this->user);
    });

    it('lists users with pagination', function () {
        User::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/users');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'message',
            ]);
    });

    it('shows a single user', function () {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'email', 'first_name', 'last_name'],
                'message',
            ]);
    });

    it('creates a new user', function () {
        $role = Role::factory()->create();

        $response = $this->postJson('/api/v1/users', [
            'first_name' => 'New',
            'last_name' => 'User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'data' => ['id', 'email', 'first_name', 'last_name'],
                'message',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
        ]);
    });

    it('updates a user', function () {
        $user = User::factory()->create();

        $response = $this->patchJson("/api/v1/users/{$user->id}", [
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['id', 'email', 'first_name', 'last_name'],
                'message',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);
    });

    it('deletes a user', function () {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/v1/users/{$user->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    });

    it('prevents deleting own account', function () {
        $response = $this->deleteJson("/api/v1/users/{$this->user->id}");

        $response->assertForbidden();
    });

    it('requires authentication for all endpoints', function () {
        // Create a fresh app instance without authentication
        $this->refreshApplication();

        $response1 = $this->getJson('/api/v1/users');
        $response2 = $this->postJson('/api/v1/users', []);
        $response3 = $this->getJson('/api/v1/users/1');
        $response4 = $this->patchJson('/api/v1/users/1', []);
        $response5 = $this->deleteJson('/api/v1/users/1');

        $response1->assertUnauthorized();
        $response2->assertUnauthorized();
        $response3->assertUnauthorized();
        $response4->assertUnauthorized();
        $response5->assertUnauthorized();
    });
});
