<?php

declare(strict_types=1);

use App\Enums\PostType;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Models\SectionTemplate;

describe('BuilderPage model', function () {
    it('belongs to a post', function () {
        $post = Post::factory()->create();
        $builderPage = BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['components' => []],
        ]);

        expect($builderPage->post)->toBeInstanceOf(Post::class);
        expect($builderPage->post->id)->toBe($post->id);
    });

    it('stores and retrieves grapes_data as JSON', function () {
        $post = Post::factory()->create();
        $data = ['components' => [['type' => 'text', 'content' => 'Hello']]];

        $builderPage = BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => $data,
        ]);

        $builderPage->refresh();

        expect($builderPage->grapes_data)->toBeArray();
        expect($builderPage->grapes_data)->toBe($data);
    });

    it('reports compiled status correctly', function () {
        $post = Post::factory()->create();

        $notCompiled = BuilderPage::create([
            'post_id' => $post->id,
        ]);

        $compiled = BuilderPage::create([
            'post_id' => Post::factory()->create()->id,
            'compiled_html' => '<div>Hello</div>',
            'compiled_at' => now(),
        ]);

        expect($notCompiled->isCompiled())->toBeFalse();
        expect($compiled->isCompiled())->toBeTrue();
    });
});

describe('Post and BuilderPage relationship', function () {
    it('post has one builder page', function () {
        $post = Post::factory()->create();
        $builderPage = BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['components' => []],
        ]);

        expect($post->builderPage)->toBeInstanceOf(BuilderPage::class);
        expect($post->builderPage->id)->toBe($builderPage->id);
    });

    it('post editor_mode defaults to tiptap', function () {
        $post = Post::factory()->create();
        $post->refresh();

        expect($post->editor_mode)->toBe('tiptap');
    });

    it('post editor_mode can be set to builder', function () {
        $post = Post::factory()->create(['editor_mode' => 'builder']);

        expect($post->editor_mode)->toBe('builder');
    });
});

describe('SectionTemplate model', function () {
    it('can be created with all fields', function () {
        $template = SectionTemplate::create([
            'name' => 'Hero Section',
            'slug' => 'hero-section',
            'category' => 'headers',
            'thumbnail' => '/images/hero-thumb.jpg',
            'grapes_data' => ['components' => [['type' => 'hero']]],
            'html_template' => '<section class="hero"><h1>Title</h1></section>',
            'css_template' => '.hero { padding: 4rem; }',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        expect($template->exists)->toBeTrue();
        expect($template->name)->toBe('Hero Section');
        expect($template->slug)->toBe('hero-section');
        expect($template->category)->toBe('headers');
        expect($template->grapes_data)->toBeArray();
        expect($template->is_active)->toBeTrue();
        expect($template->sort_order)->toBe(1);
    });

    it('has active scope', function () {
        SectionTemplate::create([
            'name' => 'Active Template',
            'slug' => 'active-template',
            'category' => 'headers',
            'html_template' => '<div>Active</div>',
            'is_active' => true,
        ]);

        SectionTemplate::create([
            'name' => 'Inactive Template',
            'slug' => 'inactive-template',
            'category' => 'headers',
            'html_template' => '<div>Inactive</div>',
            'is_active' => false,
        ]);

        $active = SectionTemplate::active()->get();

        expect($active)->toHaveCount(1);
        expect($active->first()->slug)->toBe('active-template');
    });

    it('has byCategory scope', function () {
        SectionTemplate::create([
            'name' => 'Header',
            'slug' => 'header-1',
            'category' => 'headers',
            'html_template' => '<header>H</header>',
        ]);

        SectionTemplate::create([
            'name' => 'Footer',
            'slug' => 'footer-1',
            'category' => 'footers',
            'html_template' => '<footer>F</footer>',
        ]);

        $headers = SectionTemplate::byCategory('headers')->get();

        expect($headers)->toHaveCount(1);
        expect($headers->first()->category)->toBe('headers');
    });
});

describe('PageBuilder CRUD', function () {
    beforeEach(function () {
        $this->adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    });

    it('creates a new builder page', function () {
        $response = $this->actingAs($this->admin)->post('/admin/page-builder', [
            'title' => 'My Landing Page',
        ]);

        $response->assertCreated();

        $post = Post::where('title', 'My Landing Page')->first();
        expect($post)->not->toBeNull();
        expect($post->editor_mode)->toBe('builder');
        expect($post->type->value)->toBe('page');
    });

    it('saves editor state (auto-save)', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)->put("/admin/page-builder/{$post->id}", [
            'grapes_data' => ['components' => [['type' => 'text']]],
            'grapes_css' => '.text { color: red; }',
        ]);

        $response->assertOk();

        $builderPage = BuilderPage::where('post_id', $post->id)->first();
        expect($builderPage)->not->toBeNull();
        expect($builderPage->grapes_data)->toBe(['components' => [['type' => 'text']]]);
    });

    it('loads the editor page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/admin/page-builder/{$post->id}/editor");

        $response->assertOk();
    });

    it('deletes a builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $this->admin->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => [],
            'grapes_css' => '',
        ]);

        $response = $this->actingAs($this->admin)
            ->delete("/admin/page-builder/{$post->id}");

        $response->assertOk();
        // Post uses SoftDeletes so it's trashed, not hard deleted
        expect(Post::find($post->id))->toBeNull();
        expect(Post::withTrashed()->find($post->id))->not->toBeNull();
    });
});
