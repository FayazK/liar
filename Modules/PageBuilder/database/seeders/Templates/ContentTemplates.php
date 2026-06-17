<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class ContentTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Text Block',
                'slug' => 'text-block',
                'category' => 'content',
                'tags' => ['text', 'simple', 'prose'],
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 1.5rem;">About Our Mission</h2><p style="line-height: 1.8; margin-bottom: 1rem;">We believe that everyone should have the tools to create beautiful, professional web pages without needing to write code.</p><p style="line-height: 1.8;">With an intuitive drag-and-drop interface and AI-powered content generation, you can go from idea to published page in minutes.</p></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Text + Image Split',
                'slug' => 'text-image-split',
                'category' => 'content',
                'tags' => ['image', 'split', 'two-column'],
                'html_template' => '<section class="pb-text-image" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;"><div><h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Built for Speed</h2><p style="line-height: 1.7; opacity: 0.8;">Pages compile to static HTML — no JavaScript runtime, no heavy frameworks. Just clean, fast-loading pages that search engines love.</p></div><div style="background: #f0f0f0; border-radius: 0.75rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-text-image > div { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Two Column Content',
                'slug' => 'two-column-content',
                'category' => 'content',
                'tags' => ['columns', 'text', 'editorial'],
                'html_template' => '<section class="pb-two-col-content" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Our Approach</h2><div class="pb-two-col-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;"><div><h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Design First</h3><p style="line-height: 1.7; opacity: 0.8; margin-bottom: 1rem;">We start every project with a deep understanding of your brand, audience, and goals. Our design-first approach ensures every page tells your story effectively.</p><p style="line-height: 1.7; opacity: 0.8;">From color palettes to typography, every detail is intentional and purposeful.</p></div><div><h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">Built to Scale</h3><p style="line-height: 1.7; opacity: 0.8; margin-bottom: 1rem;">Our infrastructure is designed to grow with you. Whether you have ten visitors or ten million, your pages will load fast and look great.</p><p style="line-height: 1.7; opacity: 0.8;">Enterprise-grade performance without the enterprise-grade complexity.</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-two-col-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Accordion FAQ',
                'slug' => 'accordion-faq',
                'category' => 'content',
                'tags' => ['faq', 'accordion', 'questions'],
                'html_template' => '<section class="pb-faq" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Frequently Asked Questions</h2><div style="display: flex; flex-direction: column; gap: 1rem;"><details style="background: #fff; border-radius: 0.5rem; border: 1px solid #e5e7eb;"><summary style="padding: 1.25rem; cursor: pointer; font-weight: 600; font-size: 1.0625rem;">How do I get started?</summary><div style="padding: 0 1.25rem 1.25rem; opacity: 0.8; line-height: 1.6;">Simply sign up for a free account, choose a template, and start customizing. No credit card required.</div></details><details style="background: #fff; border-radius: 0.5rem; border: 1px solid #e5e7eb;"><summary style="padding: 1.25rem; cursor: pointer; font-weight: 600; font-size: 1.0625rem;">Can I use my own domain?</summary><div style="padding: 0 1.25rem 1.25rem; opacity: 0.8; line-height: 1.6;">Yes! You can connect any custom domain to your pages. We handle the SSL certificate automatically.</div></details><details style="background: #fff; border-radius: 0.5rem; border: 1px solid #e5e7eb;"><summary style="padding: 1.25rem; cursor: pointer; font-weight: 600; font-size: 1.0625rem;">Is there a free plan?</summary><div style="padding: 0 1.25rem 1.25rem; opacity: 0.8; line-height: 1.6;">Yes, our free plan includes up to 3 pages with all core features. Upgrade anytime for unlimited pages and premium templates.</div></details><details style="background: #fff; border-radius: 0.5rem; border: 1px solid #e5e7eb;"><summary style="padding: 1.25rem; cursor: pointer; font-weight: 600; font-size: 1.0625rem;">Do I need coding knowledge?</summary><div style="padding: 0 1.25rem 1.25rem; opacity: 0.8; line-height: 1.6;">Not at all. Our visual editor lets you build professional pages without writing a single line of code.</div></details></div></div></section>',
                'css_template' => '.pb-faq details[open] summary { border-bottom: 1px solid #e5e7eb; margin-bottom: 0; } @media (max-width: 768px) { .pb-faq { padding: 2rem 1rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
