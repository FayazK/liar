<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
});

describe('Avatar Upload', function (): void {
    it('allows authenticated user to upload avatar', function (): void {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)
            ->post('/settings/avatar', ['avatar' => $file]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Avatar updated successfully']);
        expect($user->fresh()->hasMedia('avatar'))->toBeTrue();
    });

    it('validates file type', function (): void {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $this->actingAs($user)
            ->postJson('/settings/avatar', ['avatar' => $file])
            ->assertStatus(422)
            ->assertJsonValidationErrors('avatar');
    });

    it('validates file size', function (): void {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('large.jpg')->size(3000);

        $this->actingAs($user)
            ->postJson('/settings/avatar', ['avatar' => $file])
            ->assertStatus(422)
            ->assertJsonValidationErrors('avatar');
    });

    it('allows avatar deletion', function (): void {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);
        $user->addMedia($file)->toMediaCollection('avatar');

        $this->actingAs($user)
            ->delete('/settings/avatar')
            ->assertStatus(200)
            ->assertJson(['message' => 'Avatar removed successfully']);
        expect($user->fresh()->hasMedia('avatar'))->toBeFalse();
    });

    it('requires authentication to upload avatar', function (): void {
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $this->post('/settings/avatar', ['avatar' => $file])
            ->assertRedirect('/login');
    });

    it('requires authentication to delete avatar', function (): void {
        $this->delete('/settings/avatar')
            ->assertRedirect('/login');
    });

    it('returns avatar urls after upload', function (): void {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->actingAs($user)
            ->post('/settings/avatar', ['avatar' => $file]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'avatar_url',
                'avatar_thumb_url',
            ]);
    });

    it('replaces existing avatar on new upload', function (): void {
        $user = User::factory()->create();

        // Upload first avatar
        $firstFile = UploadedFile::fake()->image('first.jpg', 200, 200);
        $user->addMedia($firstFile)->toMediaCollection('avatar');
        expect($user->getMedia('avatar'))->toHaveCount(1);

        // Upload second avatar
        $secondFile = UploadedFile::fake()->image('second.jpg', 200, 200);
        $this->actingAs($user)
            ->post('/settings/avatar', ['avatar' => $secondFile])
            ->assertStatus(200);

        // Should still only have one avatar due to singleFile()
        expect($user->fresh()->getMedia('avatar'))->toHaveCount(1);
    });
});
