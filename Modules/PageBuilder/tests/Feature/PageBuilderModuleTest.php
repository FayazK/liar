<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;

describe('PageBuilder module', function () {
    it('is registered and enabled', function () {
        $statuses = json_decode(file_get_contents(base_path('modules_statuses.json')), true);
        expect($statuses['PageBuilder'])->toBeTrue();
    });

    it('provides admin navigation items', function () {
        $navItems = \Modules\PageBuilder\Providers\PageBuilderServiceProvider::adminNavItems();
        expect($navItems)->toBeArray()->not->toBeEmpty();
        expect($navItems[0]['label'])->toBe('Page Builder');
        expect($navItems[0]['route'])->toBe('/admin/page-builder');
        expect($navItems[0]['permission'])->toBe('page-builder.view');
    });

    it('provides permissions including publish', function () {
        $permissions = \Modules\PageBuilder\Providers\PageBuilderServiceProvider::permissions();
        expect($permissions)->toHaveKey('page-builder');
        expect($permissions['page-builder'])->toContain('page-builder.view');
        expect($permissions['page-builder'])->toContain('page-builder.create');
        expect($permissions['page-builder'])->toContain('page-builder.update');
        expect($permissions['page-builder'])->toContain('page-builder.delete');
        expect($permissions['page-builder'])->toContain('page-builder.publish');
    });

    it('renders the page builder index page for admin users', function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $response = $this->actingAs($user)
            ->get('/admin/page-builder');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('PageBuilder::admin/page-builder/index', shouldExist: false)
            ->has('message')
        );
    });

    it('denies access to non-admin users', function () {
        $role = Role::factory()->create(['name' => 'User']);
        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get('/admin/page-builder')
            ->assertForbidden();
    });
});
