<?php

declare(strict_types=1);

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BuilderPage;

describe('Public page rendering', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $this->user = User::factory()->create(['role_id' => $adminRole->id]);
    });

    it('renders a published builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'status' => PostStatus::Published->value,
            'slug' => 'landing-page',
            'title' => 'My Landing Page',
            'meta_title' => 'Landing Page | My Site',
            'meta_description' => 'A great landing page',
            'published_at' => now(),
            'author_id' => $this->user->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => ['html' => '<section><h1>Welcome</h1></section>'],
            'grapes_css' => '',
            'compiled_html' => '<section><h1>Welcome</h1></section>',
            'compiled_css' => 'section{padding:2rem}',
            'compiled_at' => now(),
        ]);

        $response = $this->get('/p/landing-page');

        $response->assertOk();
        $response->assertSee('Welcome');
        $response->assertSee('section{padding:2rem}');
        $response->assertSee('Landing Page | My Site');
    });

    it('returns 404 for non-existent slug', function () {
        $this->get('/p/does-not-exist')->assertNotFound();
    });

    it('returns 404 for unpublished builder page', function () {
        $post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'status' => PostStatus::Draft->value,
            'slug' => 'draft-page',
            'author_id' => $this->user->id,
        ]);

        BuilderPage::create([
            'post_id' => $post->id,
            'grapes_data' => [],
            'grapes_css' => '',
            'compiled_html' => '<h1>Draft</h1>',
            'compiled_css' => '',
            'compiled_at' => now(),
        ]);

        $this->get('/p/draft-page')->assertNotFound();
    });

    it('returns 404 for non-builder pages', function () {
        Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'tiptap',
            'status' => PostStatus::Published->value,
            'slug' => 'tiptap-page',
            'published_at' => now(),
            'author_id' => $this->user->id,
        ]);

        $this->get('/p/tiptap-page')->assertNotFound();
    });
});
