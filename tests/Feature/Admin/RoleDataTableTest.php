<?php

declare(strict_types=1);

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

describe('Role DataTable', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->user = User::factory()->create(['role_id' => $adminRole->id]);
    });

    it('returns paginated roles with default settings', function () {
        Role::factory()->count(20)->create();

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'name', 'description', 'users_count', 'permissions_count']],
                'meta' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    });

    it('searches roles by name', function () {
        Role::factory()->create(['name' => 'Administrator']);
        Role::factory()->create(['name' => 'Editor']);

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?search=administrator');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(1);
        expect($response->json('data.0.name'))->toBe('Administrator');
    });

    it('searches roles by description', function () {
        Role::factory()->create(['name' => 'Manager', 'description' => 'Manages the system']);
        Role::factory()->create(['name' => 'Viewer', 'description' => 'Views data only']);

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?search=manages');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(1);
        expect($response->json('data.0.name'))->toBe('Manager');
    });

    it('sorts roles by name ascending', function () {
        Role::factory()->create(['name' => 'Zebra']);
        Role::factory()->create(['name' => 'Beta Role']);

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?sorts=[{"column":"name","direction":"asc"}]');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name')->all();
        // When sorting by name ASC, should be: Admin, Beta Role, Zebra
        expect($names[0])->toBe('Admin');
        expect($names[1])->toBe('Beta Role');
        expect($names[2])->toBe('Zebra');
    });

    it('sorts roles by name descending', function () {
        Role::factory()->create(['name' => 'Bravo']);
        Role::factory()->create(['name' => 'Zebra']);

        $sorts = urlencode(json_encode([['column' => 'name', 'direction' => 'desc']]));
        $response = $this->actingAs($this->user)->getJson("/admin/roles/data?sorts={$sorts}");

        $response->assertOk();
        // Verify roles are present
        $names = collect($response->json('data'))->pluck('name')->all();
        expect($names)->toContain('Zebra');
        expect($names)->toContain('Bravo');
        expect($names)->toContain('Admin');
    });

    it('sorts roles by users count', function () {
        $role1 = Role::factory()->create(['name' => 'Role A']);
        $role2 = Role::factory()->create(['name' => 'Role B']);

        User::factory()->count(5)->create(['role_id' => $role1->id]);
        User::factory()->count(2)->create(['role_id' => $role2->id]);

        $sorts = urlencode(json_encode([['column' => 'users_count', 'direction' => 'desc']]));
        $response = $this->actingAs($this->user)->getJson("/admin/roles/data?sorts={$sorts}");

        $response->assertOk();
        // Verify the role with most users exists and has correct count
        $roles = collect($response->json('data'));
        $roleA = $roles->firstWhere('name', 'Role A');
        expect($roleA)->not->toBeNull();
        expect($roleA['users_count'])->toBe(5);
    });

    it('sorts roles by permissions count', function () {
        $role1 = Role::factory()->create(['name' => 'Role A']);
        $role2 = Role::factory()->create(['name' => 'Role B']);

        $permissions1 = collect(range(1, 3))->map(fn ($i) => Permission::create([
            'key' => "permission.a.{$i}",
            'title' => "Permission A {$i}",
            'module' => 'test',
        ]));

        $permissions2 = collect(range(1, 7))->map(fn ($i) => Permission::create([
            'key' => "permission.b.{$i}",
            'title' => "Permission B {$i}",
            'module' => 'test',
        ]));

        $role1->permissions()->attach($permissions1->pluck('id'));
        $role2->permissions()->attach($permissions2->pluck('id'));

        $sorts = urlencode(json_encode([['column' => 'permissions_count', 'direction' => 'desc']]));
        $response = $this->actingAs($this->user)->getJson("/admin/roles/data?sorts={$sorts}");

        $response->assertOk();
        // Verify the role with most permissions exists and has correct count
        $roles = collect($response->json('data'));
        $roleB = $roles->firstWhere('name', 'Role B');
        expect($roleB)->not->toBeNull();
        expect($roleB['permissions_count'])->toBe(7);
    });

    it('filters roles by created date range', function () {
        Role::factory()->create(['name' => 'Old Role', 'created_at' => now()->subDays(10)]);
        Role::factory()->create(['name' => 'Recent Role', 'created_at' => now()->subDays(5)]);

        $filters = json_encode([
            'created_at' => [
                'operator' => 'between',
                'value' => [now()->subDays(7)->format('Y-m-d'), now()->format('Y-m-d')],
            ],
        ]);

        $response = $this->actingAs($this->user)->getJson("/admin/roles/data?filters={$filters}");

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(1);
        expect($response->json('data.0.name'))->toBe('Recent Role');
    });

    it('respects per_page parameter', function () {
        Role::factory()->count(20)->create();

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?per_page=5');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(5);
        expect($response->json('meta.per_page'))->toBe(5);
    });

    it('paginates correctly', function () {
        Role::factory()->count(20)->create();

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?per_page=10&page=2');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(10);
        expect($response->json('meta.current_page'))->toBe(2);
    });

    it('returns empty result for non-matching search', function () {
        Role::factory()->create(['name' => 'Administrator']);

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data?search=nonexistent');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(0);
    });

    it('combines search and filters', function () {
        Role::factory()->create(['name' => 'Old Admin', 'created_at' => now()->subDays(10)]);
        Role::factory()->create(['name' => 'Recent Admin', 'created_at' => now()->subDays(5)]);
        Role::factory()->create(['name' => 'Recent Editor', 'created_at' => now()->subDays(3)]);

        $filters = json_encode([
            'created_at' => [
                'operator' => 'between',
                'value' => [now()->subDays(7)->format('Y-m-d'), now()->format('Y-m-d')],
            ],
        ]);

        $response = $this->actingAs($this->user)->getJson("/admin/roles/data?search=admin&filters={$filters}");

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(1);
        expect($response->json('data.0.name'))->toBe('Recent Admin');
    });

    it('includes users and permissions counts in response', function () {
        $role = Role::factory()->create(['name' => 'Test Role']);

        User::factory()->count(3)->create(['role_id' => $role->id]);

        $permissions = collect(range(1, 5))->map(fn ($i) => Permission::create([
            'key' => "permission.test.{$i}",
            'title' => "Test Permission {$i}",
            'module' => 'test',
        ]));

        $role->permissions()->attach($permissions->pluck('id'));

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data');

        $response->assertOk();
        // Find the Test Role in the response (Admin role also exists with 1 user)
        $testRole = collect($response->json('data'))->firstWhere('name', 'Test Role');
        expect($testRole)->not->toBeNull();
        expect($testRole['users_count'])->toBe(3);
        expect($testRole['permissions_count'])->toBe(5);
    });

    it('defaults to sorting by name', function () {
        Role::factory()->create(['name' => 'Zebra', 'created_at' => now()->subDays(1)]);
        Role::factory()->create(['name' => 'Beta Role', 'created_at' => now()]);

        $response = $this->actingAs($this->user)->getJson('/admin/roles/data');

        $response->assertOk();
        // Default sort should be by name (ascending as per RoleDataTableQueryService)
        $names = collect($response->json('data'))->pluck('name')->all();
        expect($names[0])->toBe('Admin');
        expect($names[1])->toBe('Beta Role');
        expect($names[2])->toBe('Zebra');
    });
});
