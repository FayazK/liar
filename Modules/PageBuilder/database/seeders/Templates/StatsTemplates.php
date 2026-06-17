<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class StatsTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Counter Row Stats',
                'slug' => 'stats-counter-row',
                'category' => 'stats',
                'tags' => ['counters', 'row', 'numbers'],
                'html_template' => '<section class="pb-stats-counter" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 3rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><div class="pb-stats-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center;"><div><div style="font-size: 2.5rem; font-weight: 800; color: var(--section-accent, #e94560);">10K+</div><div style="font-size: 0.875rem; opacity: 0.6; margin-top: 0.25rem;">Active Users</div></div><div><div style="font-size: 2.5rem; font-weight: 800; color: var(--section-accent, #e94560);">50M+</div><div style="font-size: 0.875rem; opacity: 0.6; margin-top: 0.25rem;">Pages Created</div></div><div><div style="font-size: 2.5rem; font-weight: 800; color: var(--section-accent, #e94560);">99.9%</div><div style="font-size: 0.875rem; opacity: 0.6; margin-top: 0.25rem;">Uptime</div></div><div><div style="font-size: 2.5rem; font-weight: 800; color: var(--section-accent, #e94560);">4.9</div><div style="font-size: 0.875rem; opacity: 0.6; margin-top: 0.25rem;">Avg Rating</div></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-stats-row { grid-template-columns: repeat(2, 1fr) !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Progress Bars Stats',
                'slug' => 'stats-progress-bars',
                'category' => 'stats',
                'tags' => ['progress', 'bars', 'skills'],
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 700px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Our Expertise</h2><div style="display: flex; flex-direction: column; gap: 1.5rem;"><div><div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="font-weight: 600; font-size: 0.9375rem;">Web Development</span><span style="opacity: 0.6; font-size: 0.875rem;">95%</span></div><div style="background: #e5e7eb; border-radius: 0.25rem; height: 8px;"><div style="background: var(--section-accent, #e94560); height: 100%; border-radius: 0.25rem; width: 95%;"></div></div></div><div><div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="font-weight: 600; font-size: 0.9375rem;">UI/UX Design</span><span style="opacity: 0.6; font-size: 0.875rem;">88%</span></div><div style="background: #e5e7eb; border-radius: 0.25rem; height: 8px;"><div style="background: var(--section-accent, #e94560); height: 100%; border-radius: 0.25rem; width: 88%;"></div></div></div><div><div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="font-weight: 600; font-size: 0.9375rem;">Performance Optimization</span><span style="opacity: 0.6; font-size: 0.875rem;">92%</span></div><div style="background: #e5e7eb; border-radius: 0.25rem; height: 8px;"><div style="background: var(--section-accent, #e94560); height: 100%; border-radius: 0.25rem; width: 92%;"></div></div></div><div><div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="font-weight: 600; font-size: 0.9375rem;">SEO Strategy</span><span style="opacity: 0.6; font-size: 0.875rem;">80%</span></div><div style="background: #e5e7eb; border-radius: 0.25rem; height: 8px;"><div style="background: var(--section-accent, #e94560); height: 100%; border-radius: 0.25rem; width: 80%;"></div></div></div></div></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Icon Number Grid Stats',
                'slug' => 'stats-icon-number-grid',
                'category' => 'stats',
                'tags' => ['icons', 'grid', 'metrics'],
                'html_template' => '<section class="pb-stats-icons" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1000px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">By the Numbers</h2><div class="pb-stats-icon-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;"><div style="text-align: center; padding: 1.5rem;"><div style="width: 56px; height: 56px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9733;</div><div style="font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem;">500+</div><p style="font-size: 0.875rem; opacity: 0.6;">Happy Clients</p></div><div style="text-align: center; padding: 1.5rem;"><div style="width: 56px; height: 56px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9998;</div><div style="font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem;">1,200+</div><p style="font-size: 0.875rem; opacity: 0.6;">Projects Delivered</p></div><div style="text-align: center; padding: 1.5rem;"><div style="width: 56px; height: 56px; background: var(--section-accent, #e94560); border-radius: 0.75rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">&#9203;</div><div style="font-size: 2rem; font-weight: 800; margin-bottom: 0.25rem;">8+</div><p style="font-size: 0.875rem; opacity: 0.6;">Years Experience</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-stats-icon-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
        ];
    }
}
