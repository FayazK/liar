<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class FeatureTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Icon Grid Features',
                'slug' => 'icon-grid-features',
                'category' => 'features',
                'tags' => ['grid', 'icons', 'three-column'],
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Why Choose Us</h2><p style="opacity: 0.7; margin-bottom: 3rem;">Everything you need to succeed</p><div class="pb-features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;"><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#10022;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fast Performance</h3><p style="opacity: 0.7;">Lightning-fast load times that keep your visitors engaged.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9672;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Easy to Use</h3><p style="opacity: 0.7;">Intuitive drag-and-drop interface anyone can master.</p></div><div style="padding: 2rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#11041;</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Fully Responsive</h3><p style="opacity: 0.7;">Looks perfect on every device, from mobile to desktop.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-features-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Alternating Features',
                'slug' => 'alternating-features',
                'category' => 'features',
                'tags' => ['alternating', 'image', 'two-column'],
                'html_template' => '<section style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 3rem;"><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Drag &amp; Drop Builder</h3><p style="opacity: 0.8; line-height: 1.6;">Build beautiful pages visually with our intuitive editor. No code needed.</p></div><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div></div><div class="pb-alt-feature" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div style="background: #e0e0e0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image</div><div><h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">AI-Powered Content</h3><p style="opacity: 0.8; line-height: 1.6;">Let AI generate and optimize your content based on your brand identity.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-alt-feature { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Feature Cards',
                'slug' => 'feature-cards',
                'category' => 'features',
                'tags' => ['cards', 'dark', 'grid'],
                'html_template' => '<section style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 2.5rem;">Powerful Features</h2><div class="pb-feature-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Templates Library</h3><p style="opacity: 0.7; font-size: 0.875rem;">Choose from dozens of pre-built sections to jumpstart your design.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">Style Presets</h3><p style="opacity: 0.7; font-size: 0.875rem;">Keep your brand consistent with curated presets.</p></div><div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 2rem; text-align: left;"><h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">One-Click Publish</h3><p style="opacity: 0.7; font-size: 0.875rem;">Compile to static HTML for blazing-fast pages.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-feature-cards { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Numbered List Features',
                'slug' => 'numbered-list-features',
                'category' => 'features',
                'tags' => ['numbered', 'list', 'steps'],
                'html_template' => '<section class="pb-numbered-features" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">How It Works</h2><div style="display: flex; flex-direction: column; gap: 2rem;"><div style="display: flex; gap: 1.5rem; align-items: flex-start;"><div style="flex-shrink: 0; width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem; font-weight: 700;">1</div><div><h3 style="font-size: 1.25rem; margin-bottom: 0.375rem;">Choose a Template</h3><p style="opacity: 0.7; line-height: 1.6;">Browse our library of professionally designed sections and pick the ones you love.</p></div></div><div style="display: flex; gap: 1.5rem; align-items: flex-start;"><div style="flex-shrink: 0; width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem; font-weight: 700;">2</div><div><h3 style="font-size: 1.25rem; margin-bottom: 0.375rem;">Customize Your Content</h3><p style="opacity: 0.7; line-height: 1.6;">Edit text, swap images, and adjust colors to match your brand perfectly.</p></div></div><div style="display: flex; gap: 1.5rem; align-items: flex-start;"><div style="flex-shrink: 0; width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem; font-weight: 700;">3</div><div><h3 style="font-size: 1.25rem; margin-bottom: 0.375rem;">Publish &amp; Share</h3><p style="opacity: 0.7; line-height: 1.6;">Hit publish and your page is live. Share it with the world instantly.</p></div></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-numbered-features { padding: 2rem 1rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
