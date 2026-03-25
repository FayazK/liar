<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class FooterTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Multi Column Footer',
                'slug' => 'footer-multi-column',
                'category' => 'footer',
                'tags' => ['columns', 'links', 'comprehensive'],
                'html_template' => '<footer class="pb-footer-multi" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 3rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto;"><div class="pb-footer-grid" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; margin-bottom: 2rem;"><div><h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; font-weight: 700;">YourBrand</h3><p style="opacity: 0.7; font-size: 0.875rem; line-height: 1.6; max-width: 280px;">Building tools that empower creators to bring their vision to life, one page at a time.</p></div><div><h4 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.5; margin-bottom: 1rem;">Product</h4><ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;"><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Features</a></li><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Pricing</a></li><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Templates</a></li></ul></div><div><h4 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.5; margin-bottom: 1rem;">Company</h4><ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;"><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">About</a></li><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Blog</a></li><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Careers</a></li></ul></div><div><h4 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.5; margin-bottom: 1rem;">Legal</h4><ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;"><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Privacy</a></li><li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.7; font-size: 0.875rem;">Terms</a></li></ul></div></div><div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; text-align: center; font-size: 0.8125rem; opacity: 0.5;">&copy; 2026 YourBrand. All rights reserved.</div></div></footer>',
                'css_template' => '@media (max-width: 768px) { .pb-footer-grid { grid-template-columns: 1fr 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Minimal Footer',
                'slug' => 'footer-minimal',
                'category' => 'footer',
                'tags' => ['minimal', 'clean', 'simple'],
                'html_template' => '<footer style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 2rem) 2rem; border-top: 1px solid #e5e7eb;"><div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;"><p style="font-size: 0.875rem; opacity: 0.6;">&copy; 2026 YourBrand</p><nav style="display: flex; gap: 1.5rem;"><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.6;">Privacy</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.6;">Terms</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.6;">Contact</a></nav></div></footer>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Social Focused Footer',
                'slug' => 'footer-social-focused',
                'category' => 'footer',
                'tags' => ['social', 'centered', 'icons'],
                'html_template' => '<footer style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 600px; margin: 0 auto;"><h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Follow Us</h3><div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;"><a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 0.875rem;">Tw</a><a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 0.875rem;">Ig</a><a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 0.875rem;">Li</a><a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 0.875rem;">Yt</a></div><p style="font-size: 0.8125rem; opacity: 0.5;">&copy; 2026 YourBrand. All rights reserved.</p></div></footer>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
        ];
    }
}
