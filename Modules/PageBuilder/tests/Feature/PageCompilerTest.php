<?php

declare(strict_types=1);

use App\Enums\PostType;
use App\Models\Post;
use App\Models\Role;
use App\Models\User;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Services\PageCompilerService;

describe('PageCompilerService', function () {
    beforeEach(function () {
        $adminRole = Role::factory()->create(['name' => 'Admin']);
        $user = User::factory()->create(['role_id' => $adminRole->id]);

        $this->post = Post::factory()->create([
            'type' => PostType::Page->value,
            'editor_mode' => 'builder',
            'author_id' => $user->id,
        ]);
    });

    it('compiles grapes data into HTML and CSS', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<section class="hero"><h1>Welcome</h1><p>Hello world</p></section>',
                'css' => '.hero { padding: 2rem; background: #f0f0f0; } .hero h1 { font-size: 2rem; }',
            ],
            'grapes_css' => '.hero { padding: 2rem; background: #f0f0f0; } .hero h1 { font-size: 2rem; }',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_html)->not->toBeNull()->not->toBeEmpty();
        expect($compiled->compiled_css)->not->toBeNull();
        expect($compiled->compiled_at)->not->toBeNull();
        expect($compiled->compiled_html)->toContain('Welcome');
        expect($compiled->compiled_html)->toContain('Hello world');
    });

    it('sanitizes HTML output by removing script tags', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<section><h1>Title</h1><script>alert("xss")</script></section>',
                'css' => '',
            ],
            'grapes_css' => '',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_html)->not->toContain('<script>');
        expect($compiled->compiled_html)->toContain('Title');
    });

    it('removes event handler attributes', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<div onclick="alert(1)"><p onmouseover="hack()">Text</p></div>',
                'css' => '',
            ],
            'grapes_css' => '',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_html)->not->toContain('onclick');
        expect($compiled->compiled_html)->not->toContain('onmouseover');
        expect($compiled->compiled_html)->toContain('Text');
    });

    it('handles empty grapes data gracefully', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => ['html' => '', 'css' => ''],
            'grapes_css' => '',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        expect($compiled->compiled_at)->not->toBeNull();
        expect($compiled->compiled_html)->toBe('');
    });

    it('minifies CSS output', function () {
        $builderPage = BuilderPage::create([
            'post_id' => $this->post->id,
            'grapes_data' => [
                'html' => '<div>content</div>',
                'css' => '.hero {  padding:  2rem;  color:  red; }',
            ],
            'grapes_css' => '.hero {  padding:  2rem;  color:  red; }',
        ]);

        $compiler = app(PageCompilerService::class);
        $compiled = $compiler->compile($builderPage);

        // Minified CSS should not have extra spaces
        expect($compiled->compiled_css)->not->toContain('  ');
    });
});
