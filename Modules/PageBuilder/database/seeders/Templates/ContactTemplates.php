<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class ContactTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Contact Form with Map',
                'slug' => 'contact-form-map',
                'category' => 'contact',
                'tags' => ['form', 'map', 'two-column'],
                'html_template' => '<section class="pb-contact-map" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Get in Touch</h2><div class="pb-contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;"><div><form style="display: flex; flex-direction: column; gap: 1rem;"><div><label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem;">Name</label><input type="text" placeholder="Your name" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem; box-sizing: border-box;"></div><div><label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem;">Email</label><input type="email" placeholder="you@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem; box-sizing: border-box;"></div><div><label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.375rem;">Message</label><textarea rows="4" placeholder="Your message..." style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem; resize: vertical; box-sizing: border-box;"></textarea></div><button type="submit" style="background: var(--section-accent, #e94560); color: #fff; padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; font-size: 0.9375rem;">Send Message</button></form></div><div style="background: #f0f0f0; border-radius: 0.75rem; min-height: 350px; display: flex; align-items: center; justify-content: center; color: #999;">Map Placeholder</div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-contact-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Simple Contact Form',
                'slug' => 'contact-simple-form',
                'category' => 'contact',
                'tags' => ['form', 'simple', 'centered'],
                'html_template' => '<section style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 600px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">Contact Us</h2><p style="text-align: center; opacity: 0.7; margin-bottom: 2rem;">We would love to hear from you</p><form style="display: flex; flex-direction: column; gap: 1rem;"><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"><input type="text" placeholder="First Name" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem;"><input type="text" placeholder="Last Name" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem;"></div><input type="email" placeholder="Email Address" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem;"><input type="text" placeholder="Subject" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem;"><textarea rows="5" placeholder="Your message..." style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.9375rem; resize: vertical;"></textarea><button type="submit" style="background: var(--section-accent, #e94560); color: #fff; padding: 0.875rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; font-size: 1rem;">Send Message</button></form></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Contact Info Cards',
                'slug' => 'contact-info-cards',
                'category' => 'contact',
                'tags' => ['cards', 'info', 'icons'],
                'html_template' => '<section class="pb-contact-info" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Reach Out to Us</h2><div class="pb-contact-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;"><div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 0.75rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem;">&#9993;</div><h3 style="font-size: 1.0625rem; margin-bottom: 0.375rem;">Email Us</h3><p style="font-size: 0.875rem; opacity: 0.7;">hello@example.com</p></div><div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 0.75rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem;">&#9742;</div><h3 style="font-size: 1.0625rem; margin-bottom: 0.375rem;">Call Us</h3><p style="font-size: 0.875rem; opacity: 0.7;">+1 (555) 123-4567</p></div><div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 0.75rem;"><div style="width: 48px; height: 48px; background: var(--section-accent, #e94560); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.25rem;">&#9906;</div><h3 style="font-size: 1.0625rem; margin-bottom: 0.375rem;">Visit Us</h3><p style="font-size: 0.875rem; opacity: 0.7;">123 Main St, Suite 100</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-contact-cards { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
        ];
    }
}
