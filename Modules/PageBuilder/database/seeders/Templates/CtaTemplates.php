<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class CtaTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Banner CTA',
                'slug' => 'banner-cta',
                'category' => 'cta',
                'tags' => ['banner', 'centered', 'bold'],
                'html_template' => '<section style="background: var(--section-accent, #e94560); color: #ffffff; padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Ready to Get Started?</h2><p style="opacity: 0.9; margin-bottom: 1.5rem;">Join thousands of creators building beautiful pages today.</p><a href="#" style="display: inline-block; background: #fff; color: #333; padding: 0.75rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Start Building</a></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Split CTA',
                'slug' => 'split-cta',
                'category' => 'cta',
                'tags' => ['split', 'inline', 'compact'],
                'html_template' => '<section class="pb-split-cta" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;"><div><h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Start Your Free Trial</h2><p style="opacity: 0.7;">No credit card required. Cancel anytime.</p></div><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; white-space: nowrap;">Get Started Free</a></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-split-cta > div { text-align: center; width: 100%; } .pb-split-cta { justify-content: center !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Minimal CTA',
                'slug' => 'minimal-cta',
                'category' => 'cta',
                'tags' => ['minimal', 'clean', 'simple'],
                'html_template' => '<section class="pb-minimal-cta" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 600px; margin: 0 auto;"><p style="font-size: 1.25rem; margin-bottom: 1.5rem; line-height: 1.6;">Ready to take the next step? Let us help you build something great.</p><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem 2rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Get in Touch</a></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-minimal-cta { padding: 2rem 1rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Floating CTA',
                'slug' => 'floating-cta',
                'category' => 'cta',
                'tags' => ['floating', 'card', 'shadow'],
                'html_template' => '<section style="background-color: var(--section-bg, #f0f2f5); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div class="pb-floating-cta" style="max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 1rem; padding: 3rem; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08);"><h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Don\'t Miss Out</h2><p style="opacity: 0.7; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">Sign up today and get exclusive access to our premium features at no extra cost.</p><div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;"><a href="#" style="display: inline-block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Sign Up Free</a><a href="#" style="display: inline-block; background: transparent; color: var(--section-text, #333); padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; border: 1px solid #ddd;">Learn More</a></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-floating-cta { padding: 2rem 1.5rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
