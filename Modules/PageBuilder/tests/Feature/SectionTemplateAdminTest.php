<?php

declare(strict_types=1);

use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\SectionTemplate;

describe('Section Template Admin', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
    });

    it('lists all section templates', function () {
        SectionTemplate::factory()->count(3)->create();

        $this->actingAs($this->admin)
            ->get('/admin/page-builder/templates')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('PageBuilder::admin/page-builder/templates/index', false)
                ->has('tags')
                ->has('categories')
            );
    });

    it('creates a custom template', function () {
        $this->actingAs($this->admin)
            ->post('/admin/page-builder/templates', [
                'name' => 'My Template',
                'category' => 'hero',
                'html_template' => '<section>Hello</section>',
                'css_template' => '',
                'tags' => ['dark'],
            ])
            ->assertCreated();

        $this->assertDatabaseHas('section_templates', [
            'name' => 'My Template',
            'is_custom' => true,
        ]);
    });

    it('updates a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);

        $this->actingAs($this->admin)
            ->put("/admin/page-builder/templates/{$template->id}", [
                'name' => 'Updated Name',
                'category' => $template->category,
                'html_template' => $template->html_template,
                'tags' => ['updated'],
            ])
            ->assertOk();

        expect($template->fresh()->name)->toBe('Updated Name');
    });

    it('deletes a custom template', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => true]);

        $this->actingAs($this->admin)
            ->delete("/admin/page-builder/templates/{$template->id}")
            ->assertOk();

        expect(SectionTemplate::find($template->id))->toBeNull();
    });

    it('prevents deletion of built-in templates', function () {
        $template = SectionTemplate::factory()->create(['is_custom' => false]);

        $this->actingAs($this->admin)
            ->delete("/admin/page-builder/templates/{$template->id}")
            ->assertForbidden();
    });
});
