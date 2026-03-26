<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class HeroTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Full Width Hero',
                'slug' => 'full-width-hero',
                'category' => 'hero',
                'tags' => ['fullscreen', 'centered', 'bold'],
                'html_template' => '<section class="pb-hero-full" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 6rem) 2rem; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><h1 style="font-size: 3rem; margin-bottom: 1rem;">Build Something Amazing</h1><p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">Create beautiful, responsive pages with our drag-and-drop builder. No coding required.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Get Started</a></div></section>',
                'css_template' => '.pb-hero-full { min-height: 60vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Split Hero',
                'slug' => 'split-hero',
                'category' => 'hero',
                'tags' => ['split', 'image', 'two-column'],
                'html_template' => '<section class="pb-hero-split" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #1a1a2e); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Your Story Starts Here</h1><p style="font-size: 1.125rem; opacity: 0.8; margin-bottom: 1.5rem;">Craft compelling pages that convert visitors into customers with our intuitive builder.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Learn More</a></div><div style="background: #f0f0f0; border-radius: 1rem; height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-hero-split > div { grid-template-columns: 1fr !important; text-align: center; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Centered Hero',
                'slug' => 'centered-hero',
                'category' => 'hero',
                'tags' => ['gradient', 'centered', 'dual-cta'],
                'html_template' => '<section class="pb-hero-centered" style="background: linear-gradient(135deg, var(--section-bg, #667eea), var(--section-accent, #764ba2)); color: var(--section-text, #ffffff); padding: var(--section-spacing, 5rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h1 style="font-size: 2.75rem; margin-bottom: 1rem;">Elegant. Simple. Powerful.</h1><p style="font-size: 1.125rem; opacity: 0.9; margin-bottom: 2rem;">Everything you need to build stunning pages, all in one place.</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="#" style="background: #fff; color: #333; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Primary Action</a><a href="#" style="background: transparent; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 2px solid rgba(255,255,255,0.5);">Secondary</a></div></div></section>',
                'css_template' => '.pb-hero-centered { min-height: 50vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Video Background Hero',
                'slug' => 'video-background-hero',
                'category' => 'hero',
                'tags' => ['dark', 'fullscreen', 'video'],
                'html_template' => '<section class="pb-hero-video" style="background-color: var(--section-bg, #000000); color: var(--section-text, #ffffff); padding: var(--section-spacing, 6rem) 2rem; text-align: center; position: relative; overflow: hidden;"><div class="pb-hero-video-bg" style="position: absolute; inset: 0; background: #000; opacity: 0.6; z-index: 1;"></div><div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;"><h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 700;">Experience the Difference</h1><p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">Immersive storytelling that captivates your audience from the first second.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 1.125rem;">Watch Demo</a></div></section>',
                'css_template' => '.pb-hero-video { min-height: 70vh; display: flex; align-items: center; justify-content: center; } @media (max-width: 768px) { .pb-hero-video { min-height: 50vh; } .pb-hero-video h1 { font-size: 2rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Gradient Overlay Hero',
                'slug' => 'gradient-overlay-hero',
                'category' => 'hero',
                'tags' => ['gradient', 'overlay', 'modern'],
                'html_template' => '<section class="pb-hero-gradient" style="background: linear-gradient(to right, var(--section-bg, #0f0c29), #302b63, var(--section-accent, #24243e)); color: var(--section-text, #ffffff); padding: var(--section-spacing, 5rem) 2rem; text-align: center;"><div style="max-width: 900px; margin: 0 auto;"><span style="display: inline-block; background: rgba(255,255,255,0.15); padding: 0.375rem 1rem; border-radius: 2rem; font-size: 0.875rem; margin-bottom: 1.5rem;">New Release</span><h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 800; line-height: 1.2;">The Next Generation of Web Building</h1><p style="font-size: 1.125rem; opacity: 0.85; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Harness the power of AI and modern design to create pages that stand out.</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Start Free Trial</a><a href="#" style="display: inline-block; background: transparent; color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">View Examples</a></div></div></section>',
                'css_template' => '.pb-hero-gradient { min-height: 60vh; display: flex; align-items: center; justify-content: center; } @media (max-width: 768px) { .pb-hero-gradient h1 { font-size: 2rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 4,
            ],
        ];
    }
}
