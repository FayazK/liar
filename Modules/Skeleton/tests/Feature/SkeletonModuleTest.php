<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;

describe('Skeleton module', function () {
    it('renders the skeleton index page for admin users', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $response = $this->actingAs($user)
            ->get('/admin/skeleton');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Skeleton::admin/skeleton/index', shouldExist: false)
            ->has('message')
        );
    });

    it('denies access to non-admin users', function () {
        $role = Role::factory()->create(['name' => 'User']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin/skeleton')
            ->assertForbidden();
    });
});
