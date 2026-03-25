<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class HeaderTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Sticky Navigation Header',
                'slug' => 'header-sticky-nav',
                'category' => 'header',
                'tags' => ['sticky', 'navigation', 'classic'],
                'html_template' => '<header class="pb-header-sticky" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: 1rem 2rem; border-bottom: 1px solid #e5e7eb;"><div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;"><div style="font-size: 1.25rem; font-weight: 700;">YourBrand</div><nav class="pb-header-nav" style="display: flex; gap: 2rem; align-items: center;"><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Home</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Features</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Pricing</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">About</a><a href="#" style="background: var(--section-accent, #e94560); color: #fff; padding: 0.5rem 1.25rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; font-size: 0.875rem;">Sign Up</a></nav></div></header>',
                'css_template' => '.pb-header-sticky { position: sticky; top: 0; z-index: 100; } @media (max-width: 768px) { .pb-header-nav { gap: 1rem !important; } .pb-header-nav a { font-size: 0.8125rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Centered Logo Header',
                'slug' => 'header-centered-logo',
                'category' => 'header',
                'tags' => ['centered', 'logo', 'elegant'],
                'html_template' => '<header style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: 1.5rem 2rem; text-align: center; border-bottom: 1px solid #e5e7eb;"><div style="max-width: 1200px; margin: 0 auto;"><div style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem;">YourBrand</div><nav style="display: flex; justify-content: center; gap: 2rem;"><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em;">Home</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em;">About</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em;">Services</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.875rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em;">Contact</a></nav></div></header>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Hamburger Mobile Header',
                'slug' => 'header-hamburger-mobile',
                'category' => 'header',
                'tags' => ['mobile', 'hamburger', 'responsive'],
                'html_template' => '<header class="pb-header-hamburger" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: 1rem 2rem;"><div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;"><div style="font-size: 1.25rem; font-weight: 700;">YourBrand</div><nav class="pb-hamburger-nav" style="display: flex; gap: 1.5rem; align-items: center;"><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Home</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Products</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Blog</a><a href="#" style="color: inherit; text-decoration: none; font-size: 0.9375rem; opacity: 0.7;">Contact</a></nav><button class="pb-hamburger-btn" style="display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&#9776;</button></div></header>',
                'css_template' => '@media (max-width: 768px) { .pb-hamburger-nav { display: none !important; } .pb-hamburger-btn { display: block !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
        ];
    }
}
