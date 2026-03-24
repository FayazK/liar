<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = $this->getTemplates();

        foreach ($templates as $template) {
            SectionTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template,
            );
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function getTemplates(): array
    {
        return [
            [
                'name' => 'Full Width Hero',
                'slug' => 'full-width-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-full" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 6rem) 2rem; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><h1 style="font-size: 3rem; margin-bottom: 1rem;">Build Something Amazing</h1><p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">Create beautiful, responsive pages with our drag-and-drop builder. No coding required.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Get Started</a></div></section>',
                'css_template' => '.pb-hero-full { min-height: 60vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Split Hero',
                'slug' => 'split-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-split" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #1a1a2e); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Your Story Starts Here</h1><p style="font-size: 1.125rem; opacity: 0.8; margin-bottom: 1.5rem;">Craft compelling pages that convert visitors into customers with our intuitive builder.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Learn More</a></div><div style="background: #f0f0f0; border-radius: 1rem; height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-hero-split > div { grid-template-columns: 1fr !important; text-align: center; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Centered Hero',
                'slug' => 'centered-hero',
                'category' => 'hero',
                'html_template' => '<section class="pb-hero-centered" style="background: linear-gradient(135deg, var(--section-bg, #667eea), var(--section-accent, #764ba2)); color: var(--section-text, #ffffff); padding: var(--section-spacing, 5rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h1 style="font-size: 2.75rem; margin-bottom: 1rem;">Elegant. Simple. Powerful.</h1><p style="font-size: 1.125rem; opacity: 0.9; margin-bottom: 2rem;">Everything you need to build stunning pages, all in one place.</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="#" style="background: #fff; color: #333; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Primary Action</a><a href="#" style="background: transparent; color: #fff; padding: 0.75rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 2px solid rgba(255,255,255,0.5);">Secondary</a></div></div></section>',
                'css_template' => '.pb-hero-centered { min-height: 50vh; display: flex; align-items: center; justify-content: center; }',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Icon Grid Features',
                'slug' => 'icon-grid-features',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Why Choose Us</h2><p style="opacity: 0.7; margin-bottom: 3rem;">Everything you need to succeed</p><div class="pb-features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;"><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#10022;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fast Performance</h3><p style="opacity: 0.7;">Lightning-fast load times that keep your visitors engaged.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9672;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Easy to Use</h3><p style="opacity: 0.7;">Intuitive drag-and-drop interface anyone can master.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#11041;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fully Responsive</h3><p style="opacity: 0.7;">Looks perfect on every device, from mobile to desktop.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-features-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Alternating Features',
                'slug' => 'alternating-features',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 3rem;"><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Drag &amp; Drop Builder</h3><p style="opacity: 0.8; line-height: 1.6;">Build beautiful pages visually with our intuitive editor. No code needed.</p></div><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div></div><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">AI-Powered Content</h3><p style="opacity: 0.8; line-height: 1.6;">Let AI generate and optimize your content based on your brand identity.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-alt-feature { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Feature Cards',
                'slug' => 'feature-cards',
                'category' => 'features',
                'html_template' => '<section style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 2.5rem;">Powerful Features</h2><div class="pb-feature-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Templates Library</h3><p style="opacity: 0.7; font-size: 0.875rem;">Choose from dozens of pre-built sections to jumpstart your design.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Style Presets</h3><p style="opacity: 0.7; font-size: 0.875rem;">Keep your brand consistent with curated presets.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">One-Click Publish</h3><p style="opacity: 0.7; font-size: 0.875rem;">Compile to static HTML for blazing-fast pages.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-feature-cards { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Banner CTA',
                'slug' => 'banner-cta',
                'category' => 'cta',
                'html_template' => '<section style="background: var(--section-accent, #e94560); color: #ffffff; padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Ready to Get Started?</h2><p style="opacity: 0.9; margin-bottom: 1.5rem;">Join thousands of creators building beautiful pages today.</p><a href="#" style="display: inline-block; background: #fff; color: #333; padding: 0.75rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Start Building</a></div></section>',
                'css_template' => '',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Split CTA',
                'slug' => 'split-cta',
                'category' => 'cta',
                'html_template' => '<section class="pb-split-cta" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;"><div><h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Start Your Free Trial</h2><p style="opacity: 0.7;">No credit card required. Cancel anytime.</p></div><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; white-space: nowrap;">Get Started Free</a></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-split-cta > div { text-align: center; width: 100%; } .pb-split-cta { justify-content: center !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Text Block',
                'slug' => 'text-block',
                'category' => 'content',
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 1.5rem;">About Our Mission</h2><p style="line-height: 1.8; margin-bottom: 1rem;">We believe that everyone should have the tools to create beautiful, professional web pages without needing to write code.</p><p style="line-height: 1.8;">With an intuitive drag-and-drop interface and AI-powered content generation, you can go from idea to published page in minutes.</p></div></section>',
                'css_template' => '',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Text + Image Split',
                'slug' => 'text-image-split',
                'category' => 'content',
                'html_template' => '<section class="pb-text-image" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Built for Speed</h2><p style="line-height: 1.7; opacity: 0.8;">Pages compile to static HTML — no JavaScript runtime, no heavy frameworks. Just clean, fast-loading pages that search engines love.</p></div><div style="background: #f0f0f0; border-radius: 0.75rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-text-image > div { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];
    }
}
