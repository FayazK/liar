<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class PricingTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Two Tier Pricing',
                'slug' => 'pricing-two-tier',
                'category' => 'pricing',
                'tags' => ['cards', 'two-column', 'simple'],
                'html_template' => '<section class="pb-pricing-two" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 900px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Simple Pricing</h2><p style="opacity: 0.7; margin-bottom: 3rem;">No hidden fees. No surprises.</p><div class="pb-pricing-two-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;"><div style="border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 2.5rem 2rem; text-align: center;"><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Starter</h3><div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">$9<span style="font-size: 1rem; font-weight: 400; opacity: 0.6;">/mo</span></div><ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;"><li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">3 Pages</li><li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">Basic Templates</li><li style="padding: 0.5rem 0;">Email Support</li></ul><a href="#" style="display: block; background: transparent; color: var(--section-accent, #e94560); padding: 0.75rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 2px solid var(--section-accent, #e94560);">Choose Starter</a></div><div style="border: 2px solid var(--section-accent, #e94560); border-radius: 0.75rem; padding: 2.5rem 2rem; text-align: center; position: relative;"><div style="position: absolute; top: -0.75rem; left: 50%; transform: translateX(-50%); background: var(--section-accent, #e94560); color: #fff; padding: 0.25rem 1rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;">Popular</div><h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Pro</h3><div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">$29<span style="font-size: 1rem; font-weight: 400; opacity: 0.6;">/mo</span></div><ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;"><li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">Unlimited Pages</li><li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">All Templates</li><li style="padding: 0.5rem 0;">Priority Support</li></ul><a href="#" style="display: block; background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600;">Choose Pro</a></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-pricing-two-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Three Tier Pricing',
                'slug' => 'pricing-three-tier',
                'category' => 'pricing',
                'tags' => ['popular', 'cards', 'highlight'],
                'html_template' => '<section class="pb-pricing-three" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Choose Your Plan</h2><p style="opacity: 0.7; margin-bottom: 3rem;">Scale as you grow</p><div class="pb-pricing-three-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: start;"><div style="background: #fff; border-radius: 0.75rem; padding: 2rem; text-align: center; border: 1px solid #e5e7eb;"><h3 style="font-size: 1.125rem; margin-bottom: 1rem;">Basic</h3><div style="font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem;">$0<span style="font-size: 0.875rem; font-weight: 400; opacity: 0.6;">/mo</span></div><a href="#" style="display: block; background: transparent; color: var(--section-accent, #e94560); padding: 0.625rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 1px solid var(--section-accent, #e94560); margin-bottom: 1.5rem;">Get Started</a><ul style="list-style: none; padding: 0; text-align: left; font-size: 0.875rem;"><li style="padding: 0.5rem 0;">1 Page</li><li style="padding: 0.5rem 0;">Community Support</li></ul></div><div style="background: var(--section-accent, #e94560); color: #fff; border-radius: 0.75rem; padding: 2.5rem 2rem; text-align: center; transform: scale(1.05);"><h3 style="font-size: 1.125rem; margin-bottom: 1rem;">Professional</h3><div style="font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem;">$19<span style="font-size: 0.875rem; font-weight: 400; opacity: 0.8;">/mo</span></div><a href="#" style="display: block; background: #fff; color: #333; padding: 0.625rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; margin-bottom: 1.5rem;">Get Started</a><ul style="list-style: none; padding: 0; text-align: left; font-size: 0.875rem;"><li style="padding: 0.5rem 0;">Unlimited Pages</li><li style="padding: 0.5rem 0;">Priority Support</li><li style="padding: 0.5rem 0;">Custom Domain</li></ul></div><div style="background: #fff; border-radius: 0.75rem; padding: 2rem; text-align: center; border: 1px solid #e5e7eb;"><h3 style="font-size: 1.125rem; margin-bottom: 1rem;">Enterprise</h3><div style="font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem;">$49<span style="font-size: 0.875rem; font-weight: 400; opacity: 0.6;">/mo</span></div><a href="#" style="display: block; background: transparent; color: var(--section-accent, #e94560); padding: 0.625rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; border: 1px solid var(--section-accent, #e94560); margin-bottom: 1.5rem;">Contact Sales</a><ul style="list-style: none; padding: 0; text-align: left; font-size: 0.875rem;"><li style="padding: 0.5rem 0;">Everything in Pro</li><li style="padding: 0.5rem 0;">SLA &amp; Onboarding</li><li style="padding: 0.5rem 0;">Dedicated Account Manager</li></ul></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-pricing-three-grid { grid-template-columns: 1fr !important; } .pb-pricing-three-grid > div:nth-child(2) { transform: none !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Comparison Table Pricing',
                'slug' => 'pricing-comparison-table',
                'category' => 'pricing',
                'tags' => ['table', 'comparison', 'detailed'],
                'html_template' => '<section class="pb-pricing-table" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 900px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Compare Plans</h2><div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; text-align: center;"><thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="padding: 1rem; text-align: left;">Feature</th><th style="padding: 1rem;">Free</th><th style="padding: 1rem; color: var(--section-accent, #e94560); font-weight: 700;">Pro</th><th style="padding: 1rem;">Enterprise</th></tr></thead><tbody><tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 0.875rem 1rem; text-align: left;">Pages</td><td style="padding: 0.875rem;">1</td><td style="padding: 0.875rem;">Unlimited</td><td style="padding: 0.875rem;">Unlimited</td></tr><tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 0.875rem 1rem; text-align: left;">Templates</td><td style="padding: 0.875rem;">5</td><td style="padding: 0.875rem;">All</td><td style="padding: 0.875rem;">All + Custom</td></tr><tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 0.875rem 1rem; text-align: left;">Custom Domain</td><td style="padding: 0.875rem;">&#10005;</td><td style="padding: 0.875rem;">&#10003;</td><td style="padding: 0.875rem;">&#10003;</td></tr><tr><td style="padding: 0.875rem 1rem; text-align: left;">Support</td><td style="padding: 0.875rem;">Community</td><td style="padding: 0.875rem;">Priority</td><td style="padding: 0.875rem;">Dedicated</td></tr></tbody></table></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-pricing-table table { font-size: 0.875rem; } .pb-pricing-table th, .pb-pricing-table td { padding: 0.5rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Single Highlight Pricing',
                'slug' => 'pricing-single-highlight',
                'category' => 'pricing',
                'tags' => ['single', 'centered', 'minimal'],
                'html_template' => '<section style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 4rem) 2rem; text-align: center;"><div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 3rem 2rem;"><h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">One Plan. Everything Included.</h2><div style="font-size: 3rem; font-weight: 800; margin: 1.5rem 0;">$15<span style="font-size: 1rem; font-weight: 400; opacity: 0.6;">/month</span></div><ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left; max-width: 300px; margin-left: auto; margin-right: auto;"><li style="padding: 0.625rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);">&#10003; Unlimited Pages</li><li style="padding: 0.625rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);">&#10003; All Templates</li><li style="padding: 0.625rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);">&#10003; Custom Domain</li><li style="padding: 0.625rem 0;">&#10003; Priority Support</li></ul><a href="#" style="display: block; background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 1.0625rem;">Start Your Free Trial</a></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
