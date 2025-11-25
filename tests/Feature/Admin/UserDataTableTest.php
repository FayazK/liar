<?php

declare(strict_types=1);

use App\Models\User;

describe('User DataTable API', function () {
    test('rejects unauthenticated requests', function () {
        $response = $this->getJson('/admin/users/data');

        $response->assertUnauthorized();
    });

    test('returns paginated users for authenticated users', function () {
        $user = User::factory()->create();
        User::factory()->count(5)->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data');

        $response->assertOk();
        $response->assertJsonStructure([
            'data',
            'links',
            'meta' => [
                'current_page',
                'from',
                'last_page',
                'per_page',
                'to',
                'total',
            ],
        ]);
    });

    test('validates sort_by against whitelist', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?sort_by=password');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['sort_by']);
    });

    test('validates sort_direction only allows asc or desc', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?sort_direction=INVALID');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['sort_direction']);
    });

    test('accepts valid sort parameters', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?sort_by=created_at&sort_direction=desc');

        $response->assertOk();
    });

    test('limits per_page to maximum 100', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?per_page=10000');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['per_page']);
    });

    test('accepts valid per_page within range', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?per_page=50');

        $response->assertOk();
        expect($response->json('meta.per_page'))->toBe(50);
    });

    test('limits search string length to 255 characters', function () {
        $user = User::factory()->create();
        $longSearch = str_repeat('a', 300);

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?search='.$longSearch);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['search']);
    });

    test('filters users by search term', function () {
        $user = User::factory()->create(['first_name' => 'John', 'last_name' => 'Doe']);
        User::factory()->create(['first_name' => 'Jane', 'last_name' => 'Smith']);

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?search=John');

        $response->assertOk();
        expect($response->json('meta.total'))->toBe(1);
    });

    test('filters users by is_active status', function () {
        $activeUser = User::factory()->create(['is_active' => true]);
        User::factory()->create(['is_active' => false]);

        $response = $this
            ->actingAs($activeUser)
            ->getJson('/admin/users/data?is_active=true');

        $response->assertOk();
        // All returned users should be active
        $data = $response->json('data');
        foreach ($data as $userData) {
            expect($userData['is_active'])->toBeTrue();
        }
    });

    test('filters users by date range', function () {
        $user = User::factory()->create(['created_at' => now()]);
        User::factory()->create(['created_at' => now()->subYear()]);

        $startDate = now()->subMonth()->format('Y-m-d');
        $endDate = now()->addDay()->format('Y-m-d');
        $dateRange = json_encode([$startDate, $endDate]);

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?created_at='.urlencode($dateRange));

        $response->assertOk();
        // Should return only users created in the date range
        expect($response->json('meta.total'))->toBe(1);
    });

    test('handles invalid JSON in date range filter gracefully', function () {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?created_at=invalid-json');

        // Should still return results (invalid filter is ignored)
        $response->assertOk();
    });

    test('sorts users by specified column', function () {
        $user = User::factory()->create(['email' => 'aaa@example.com']);
        User::factory()->create(['email' => 'zzz@example.com']);

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?sort_by=email&sort_direction=asc');

        $response->assertOk();
        $data = $response->json('data');
        expect($data[0]['email'])->toBe('aaa@example.com');
    });

    test('returns correct pagination metadata', function () {
        $user = User::factory()->create();
        User::factory()->count(25)->create();

        $response = $this
            ->actingAs($user)
            ->getJson('/admin/users/data?per_page=10&page=2');

        $response->assertOk();
        expect($response->json('meta.current_page'))->toBe(2);
        expect($response->json('meta.per_page'))->toBe(10);
        expect($response->json('meta.total'))->toBe(26); // Including the test user
    });
});
