<?php

declare(strict_types=1);

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

describe('Admin Area Authorization', function () {
    it('redirects unauthenticated users to login', function () {
        $this->get('/admin')
            ->assertRedirect('/login');
    });

    it('denies access to regular authenticated users without admin permission', function () {
        $role = Role::factory()->create(['name' => 'User']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin')
            ->assertForbidden();
    });

    it('allows access to root users', function () {
        $rootUser = User::factory()->create([
            'email' => config('auth.root_users')[0],
        ]);

        $this->actingAs($rootUser)
            ->get('/admin')
            ->assertOk();
    });

    it('allows access to users with Admin role', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $adminUser = User::factory()->create(['role_id' => $adminRole->id]);

        $this->actingAs($adminUser)
            ->get('/admin')
            ->assertOk();
    });

    it('allows access to users with admin.access permission', function () {
        $permission = Permission::create([
            'key' => 'admin.access',
            'title' => 'Access Admin Area',
            'description' => 'Access the admin dashboard and management area',
            'module' => 'admin',
        ]);

        $role = Role::factory()->create(['name' => 'Manager']);
        $role->permissions()->attach($permission->id);

        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin')
            ->assertOk();
    });

    it('denies access to users without admin.access permission', function () {
        $role = Role::factory()->create(['name' => 'Editor']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin')
            ->assertForbidden();
    });
});
