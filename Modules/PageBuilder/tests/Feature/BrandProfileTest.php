<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BrandProfile;
use Modules\PageBuilder\Repositories\BrandProfileRepository;

describe('BrandProfile', function () {
    it('creates a brand profile', function () {
        $profile = BrandProfile::factory()->create([
            'business_name' => 'Acme Corp',
            'industry' => 'Technology',
            'tone_of_voice' => 'friendly',
            'target_audience' => 'Developers aged 25-40',
            'color_palette' => ['primary' => '#ff0000', 'secondary' => '#00ff00', 'accent' => '#0000ff'],
            'font_preferences' => ['heading' => 'Inter', 'body' => 'Inter'],
            'brand_description' => 'A tech company.',
        ]);

        expect($profile->exists)->toBeTrue();
        expect($profile->business_name)->toBe('Acme Corp');
        expect($profile->industry)->toBe('Technology');
        expect($profile->tone_of_voice)->toBe('friendly');
    });

    it('updates existing profile via createOrUpdate', function () {
        BrandProfile::factory()->create(['business_name' => 'Original Name']);

        $repository = new BrandProfileRepository;
        $updated = $repository->createOrUpdate(['business_name' => 'Updated Name']);

        expect(BrandProfile::count())->toBe(1);
        expect($updated->business_name)->toBe('Updated Name');
    });

    it('returns null when no profile exists', function () {
        $repository = new BrandProfileRepository;

        expect($repository->getActive())->toBeNull();
    });

    it('returns the brand profile when one exists', function () {
        $profile = BrandProfile::factory()->create();

        $repository = new BrandProfileRepository;

        expect($repository->getActive())->not->toBeNull();
        expect($repository->getActive()->id)->toBe($profile->id);
    });

    it('casts color_palette to array', function () {
        $profile = BrandProfile::factory()->create([
            'business_name' => 'Color Corp',
            'color_palette' => ['primary' => '#111111', 'secondary' => '#222222', 'accent' => '#333333'],
        ]);

        $profile->refresh();

        expect($profile->color_palette)->toBeArray();
        expect($profile->color_palette['primary'])->toBe('#111111');
    });

    it('casts font_preferences to array', function () {
        $profile = BrandProfile::factory()->create([
            'business_name' => 'Font Corp',
            'font_preferences' => ['heading' => 'Roboto', 'body' => 'Open Sans'],
        ]);

        $profile->refresh();

        expect($profile->font_preferences)->toBeArray();
        expect($profile->font_preferences['heading'])->toBe('Roboto');
        expect($profile->font_preferences['body'])->toBe('Open Sans');
    });
});

describe('BrandProfile Controller', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
    });

    it('renders brand profile page', function () {
        $this->actingAs($this->admin)
            ->get('/admin/page-builder/brand-profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('PageBuilder::admin/page-builder/brand-profile', false)
                ->has('brandProfile')
            );
    });

    it('renders brand profile page with null when no profile exists', function () {
        $this->actingAs($this->admin)
            ->get('/admin/page-builder/brand-profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('brandProfile', null)
            );
    });

    it('saves brand profile', function () {
        $this->actingAs($this->admin)
            ->put('/admin/page-builder/brand-profile', [
                'business_name' => 'Test Corp',
                'tone_of_voice' => 'professional',
                'industry' => 'Technology',
                'target_audience' => 'Developers',
                'brand_description' => 'A great company.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('brand_profiles', [
            'business_name' => 'Test Corp',
            'tone_of_voice' => 'professional',
            'industry' => 'Technology',
        ]);
    });

    it('validates required fields', function () {
        $this->actingAs($this->admin)
            ->put('/admin/page-builder/brand-profile', [])
            ->assertSessionHasErrors(['business_name', 'tone_of_voice']);
    });

    it('updates existing profile', function () {
        BrandProfile::factory()->create([
            'business_name' => 'Old Name',
            'tone_of_voice' => 'casual',
        ]);

        $this->actingAs($this->admin)
            ->put('/admin/page-builder/brand-profile', [
                'business_name' => 'New Name',
                'tone_of_voice' => 'professional',
            ])
            ->assertRedirect();

        expect(BrandProfile::count())->toBe(1);
        expect(BrandProfile::first()->business_name)->toBe('New Name');
        expect(BrandProfile::first()->tone_of_voice)->toBe('professional');
    });
});
