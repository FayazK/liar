<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class TeamTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Team Card Grid',
                'slug' => 'team-card-grid',
                'category' => 'team',
                'tags' => ['cards', 'grid', 'social'],
                'html_template' => '<section class="pb-team-cards" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1100px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">Meet the Team</h2><p style="text-align: center; opacity: 0.7; margin-bottom: 3rem;">The people behind the product</p><div class="pb-team-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;"><article style="text-align: center;"><div style="width: 120px; height: 120px; background: #f0f0f0; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #999; font-size: 2rem;">&#9787;</div><h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">Alice Johnson</h3><p style="font-size: 0.875rem; opacity: 0.6; margin-bottom: 0.75rem;">CEO &amp; Founder</p><div style="display: flex; gap: 0.75rem; justify-content: center;"><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">LinkedIn</a><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">Twitter</a></div></article><article style="text-align: center;"><div style="width: 120px; height: 120px; background: #f0f0f0; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #999; font-size: 2rem;">&#9787;</div><h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">Bob Smith</h3><p style="font-size: 0.875rem; opacity: 0.6; margin-bottom: 0.75rem;">CTO</p><div style="display: flex; gap: 0.75rem; justify-content: center;"><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">LinkedIn</a><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">GitHub</a></div></article><article style="text-align: center;"><div style="width: 120px; height: 120px; background: #f0f0f0; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #999; font-size: 2rem;">&#9787;</div><h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">Carol Lee</h3><p style="font-size: 0.875rem; opacity: 0.6; margin-bottom: 0.75rem;">Lead Designer</p><div style="display: flex; gap: 0.75rem; justify-content: center;"><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">Dribbble</a><a href="#" style="color: var(--section-accent, #e94560); text-decoration: none;">Twitter</a></div></article></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-team-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Team List with Bio',
                'slug' => 'team-list-bio',
                'category' => 'team',
                'tags' => ['list', 'bio', 'detailed'],
                'html_template' => '<section class="pb-team-list" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Our Leadership</h2><div style="display: flex; flex-direction: column; gap: 2rem;"><div class="pb-team-member" style="display: flex; gap: 1.5rem; align-items: flex-start; background: #fff; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #e5e7eb;"><div style="flex-shrink: 0; width: 80px; height: 80px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 1.5rem;">&#9787;</div><div><h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">Daniel Park</h3><p style="font-size: 0.8125rem; color: var(--section-accent, #e94560); margin-bottom: 0.5rem;">Head of Engineering</p><p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">Daniel brings 15 years of experience in building scalable web applications. He leads our engineering team with a focus on performance and reliability.</p></div></div><div class="pb-team-member" style="display: flex; gap: 1.5rem; align-items: flex-start; background: #fff; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #e5e7eb;"><div style="flex-shrink: 0; width: 80px; height: 80px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 1.5rem;">&#9787;</div><div><h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">Emma Wilson</h3><p style="font-size: 0.8125rem; color: var(--section-accent, #e94560); margin-bottom: 0.5rem;">Head of Product</p><p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">Emma is passionate about creating products that users love. She ensures every feature we build serves a real user need.</p></div></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-team-member { flex-direction: column !important; text-align: center; align-items: center !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Minimal Avatars Team',
                'slug' => 'team-minimal-avatars',
                'category' => 'team',
                'tags' => ['minimal', 'avatars', 'compact'],
                'html_template' => '<section style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 3rem) 2rem; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Built by a World-Class Team</h2><p style="opacity: 0.7; margin-bottom: 2rem;">Engineers, designers, and dreamers working together.</p><div style="display: flex; justify-content: center; gap: -0.5rem; flex-wrap: wrap;"><div style="width: 56px; height: 56px; background: var(--section-accent, #e94560); border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">AJ</div><div style="width: 56px; height: 56px; background: #667eea; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">BS</div><div style="width: 56px; height: 56px; background: #764ba2; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">CL</div><div style="width: 56px; height: 56px; background: #f093fb; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">DP</div><div style="width: 56px; height: 56px; background: #4facfe; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">EW</div><div style="width: 56px; height: 56px; background: #43e97b; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 0.875rem; margin-left: -0.5rem;">+8</div></div></div></section>',
                'css_template' => '',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
        ];
    }
}
