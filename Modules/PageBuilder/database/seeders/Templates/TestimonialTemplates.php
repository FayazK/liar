<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class TestimonialTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Testimonial Carousel',
                'slug' => 'testimonial-carousel',
                'category' => 'testimonials',
                'tags' => ['carousel', 'slider', 'quotes'],
                'html_template' => '<section class="pb-testimonial-carousel" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem; text-align: center;"><div style="max-width: 700px; margin: 0 auto;"><h2 style="font-size: 2rem; margin-bottom: 2.5rem;">What Our Customers Say</h2><div style="background: #fff; border-radius: 0.75rem; padding: 2.5rem; border: 1px solid #e5e7eb;"><p style="font-size: 1.125rem; line-height: 1.7; font-style: italic; margin-bottom: 1.5rem;">"This builder has completely transformed how we create landing pages. What used to take days now takes hours."</p><div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600;">JD</div><div style="text-align: left;"><div style="font-weight: 600;">Jane Doe</div><div style="font-size: 0.875rem; opacity: 0.6;">CEO, Acme Corp</div></div></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-testimonial-carousel { padding: 2rem 1rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Three Card Testimonials',
                'slug' => 'testimonial-three-card',
                'category' => 'testimonials',
                'tags' => ['cards', 'grid', 'reviews'],
                'html_template' => '<section class="pb-testimonial-cards" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Trusted by Thousands</h2><div class="pb-testimonial-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"><div style="background: #f8f9fa; border-radius: 0.75rem; padding: 2rem;"><div style="color: var(--section-accent, #e94560); font-size: 1.5rem; margin-bottom: 1rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p style="line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.9375rem;">"Incredibly intuitive. I built my entire portfolio site in an afternoon."</p><div style="font-weight: 600; font-size: 0.875rem;">Sarah M.</div><div style="font-size: 0.8125rem; opacity: 0.6;">Freelance Designer</div></div><div style="background: #f8f9fa; border-radius: 0.75rem; padding: 2rem;"><div style="color: var(--section-accent, #e94560); font-size: 1.5rem; margin-bottom: 1rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p style="line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.9375rem;">"The templates are beautiful and the customization options are endless."</p><div style="font-weight: 600; font-size: 0.875rem;">Mike R.</div><div style="font-size: 0.8125rem; opacity: 0.6;">Marketing Director</div></div><div style="background: #f8f9fa; border-radius: 0.75rem; padding: 2rem;"><div style="color: var(--section-accent, #e94560); font-size: 1.5rem; margin-bottom: 1rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p style="line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.9375rem;">"Best page builder I have ever used. Period. The team support is outstanding."</p><div style="font-weight: 600; font-size: 0.875rem;">Alex T.</div><div style="font-size: 0.8125rem; opacity: 0.6;">Startup Founder</div></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-testimonial-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Single Quote Testimonial',
                'slug' => 'testimonial-single-quote',
                'category' => 'testimonials',
                'tags' => ['single', 'quote', 'large'],
                'html_template' => '<section style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 5rem) 2rem; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><div style="font-size: 4rem; line-height: 1; opacity: 0.3; margin-bottom: 1rem;">&#10077;</div><blockquote style="font-size: 1.375rem; line-height: 1.7; font-style: italic; margin: 0 0 2rem;">"Working with this tool has been a game-changer for our marketing team. We ship pages 10x faster and they look better than ever."</blockquote><div><div style="font-weight: 600; font-size: 1.0625rem;">David Chen</div><div style="opacity: 0.6; font-size: 0.875rem;">VP of Marketing, TechFlow Inc.</div></div></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Logo Wall Testimonial',
                'slug' => 'testimonial-logo-wall',
                'category' => 'testimonials',
                'tags' => ['logos', 'trust', 'brands'],
                'html_template' => '<section class="pb-logo-wall" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 1000px; margin: 0 auto;"><p style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.5; margin-bottom: 2rem;">Trusted by leading companies</p><div class="pb-logo-grid" style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap;"><div style="background: #f0f0f0; border-radius: 0.5rem; padding: 1rem 2rem; color: #999; font-weight: 600;">Logo 1</div><div style="background: #f0f0f0; border-radius: 0.5rem; padding: 1rem 2rem; color: #999; font-weight: 600;">Logo 2</div><div style="background: #f0f0f0; border-radius: 0.5rem; padding: 1rem 2rem; color: #999; font-weight: 600;">Logo 3</div><div style="background: #f0f0f0; border-radius: 0.5rem; padding: 1rem 2rem; color: #999; font-weight: 600;">Logo 4</div><div style="background: #f0f0f0; border-radius: 0.5rem; padding: 1rem 2rem; color: #999; font-weight: 600;">Logo 5</div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-logo-grid { gap: 1.5rem !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
