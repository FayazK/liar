<?php

declare(strict_types=1);

use App\Models\User;

describe('Horizon Authorization', function () {
    it('redirects unauthenticated users to login', function () {
        $this->get('/horizon')
            ->assertRedirect('/login');
    });

    it('denies access to non-root authenticated users', function () {
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);

        $this->actingAs($user)
            ->get('/horizon')
            ->assertForbidden();
    });

    it('allows access to root users', function () {
        $rootUser = User::factory()->create([
            'email' => config('auth.root_users')[0],
        ]);

        $this->actingAs($rootUser)
            ->get('/horizon')
            ->assertOk();
    });
});
