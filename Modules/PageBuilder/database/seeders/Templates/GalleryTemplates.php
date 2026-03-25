<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

class GalleryTemplates implements TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array
    {
        return [
            [
                'name' => 'Masonry Grid Gallery',
                'slug' => 'gallery-masonry-grid',
                'category' => 'gallery',
                'tags' => ['masonry', 'grid', 'images'],
                'html_template' => '<section class="pb-gallery-masonry" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Our Work</h2><div class="pb-masonry-grid" style="columns: 3; column-gap: 1rem;"><div style="break-inside: avoid; margin-bottom: 1rem; background: #f0f0f0; border-radius: 0.5rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Image 1</div><div style="break-inside: avoid; margin-bottom: 1rem; background: #e8e8e8; border-radius: 0.5rem; height: 350px; display: flex; align-items: center; justify-content: center; color: #999;">Image 2</div><div style="break-inside: avoid; margin-bottom: 1rem; background: #f0f0f0; border-radius: 0.5rem; height: 200px; display: flex; align-items: center; justify-content: center; color: #999;">Image 3</div><div style="break-inside: avoid; margin-bottom: 1rem; background: #e8e8e8; border-radius: 0.5rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">Image 4</div><div style="break-inside: avoid; margin-bottom: 1rem; background: #f0f0f0; border-radius: 0.5rem; height: 280px; display: flex; align-items: center; justify-content: center; color: #999;">Image 5</div><div style="break-inside: avoid; margin-bottom: 1rem; background: #e8e8e8; border-radius: 0.5rem; height: 220px; display: flex; align-items: center; justify-content: center; color: #999;">Image 6</div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-masonry-grid { columns: 1 !important; } } @media (min-width: 769px) and (max-width: 1024px) { .pb-masonry-grid { columns: 2 !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 0,
            ],
            [
                'name' => 'Lightbox Grid Gallery',
                'slug' => 'gallery-lightbox-grid',
                'category' => 'gallery',
                'tags' => ['lightbox', 'grid', 'overlay'],
                'html_template' => '<section class="pb-gallery-lightbox" style="background-color: var(--section-bg, #1a1a2e); color: var(--section-text, #ffffff); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Gallery</h2><div class="pb-lightbox-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;"><div style="position: relative; background: #2a2a4e; border-radius: 0.5rem; height: 200px; display: flex; align-items: center; justify-content: center; color: #666; overflow: hidden; cursor: pointer;"><span>Image 1</span><div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;"><span style="color: #fff; font-size: 1.5rem;">&#8599;</span></div></div><div style="position: relative; background: #2a2a4e; border-radius: 0.5rem; height: 200px; display: flex; align-items: center; justify-content: center; color: #666; overflow: hidden; cursor: pointer;"><span>Image 2</span></div><div style="position: relative; background: #2a2a4e; border-radius: 0.5rem; height: 200px; display: flex; align-items: center; justify-content: center; color: #666; overflow: hidden; cursor: pointer;"><span>Image 3</span></div><div style="position: relative; background: #2a2a4e; border-radius: 0.5rem; height: 200px; display: flex; align-items: center; justify-content: center; color: #666; overflow: hidden; cursor: pointer;"><span>Image 4</span></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-lightbox-grid { grid-template-columns: repeat(2, 1fr) !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Gallery Slider',
                'slug' => 'gallery-slider',
                'category' => 'gallery',
                'tags' => ['slider', 'horizontal', 'scroll'],
                'html_template' => '<section class="pb-gallery-slider" style="background-color: var(--section-bg, #ffffff); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Featured Work</h2><div class="pb-slider-track" style="display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory;"><div style="flex: 0 0 350px; scroll-snap-align: start; background: #f0f0f0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Slide 1</div><div style="flex: 0 0 350px; scroll-snap-align: start; background: #e8e8e8; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Slide 2</div><div style="flex: 0 0 350px; scroll-snap-align: start; background: #f0f0f0; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Slide 3</div><div style="flex: 0 0 350px; scroll-snap-align: start; background: #e8e8e8; border-radius: 0.75rem; height: 250px; display: flex; align-items: center; justify-content: center; color: #999;">Slide 4</div></div></div></section>',
                'css_template' => '.pb-slider-track::-webkit-scrollbar { height: 6px; } .pb-slider-track::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; } @media (max-width: 768px) { .pb-slider-track > div { flex: 0 0 280px !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Before After Gallery',
                'slug' => 'gallery-before-after',
                'category' => 'gallery',
                'tags' => ['comparison', 'before-after', 'split'],
                'html_template' => '<section class="pb-before-after" style="background-color: var(--section-bg, #f8f9fa); color: var(--section-text, #333); padding: var(--section-spacing, 4rem) 2rem;"><div style="max-width: 900px; margin: 0 auto;"><h2 style="font-size: 2rem; text-align: center; margin-bottom: 2.5rem;">Before &amp; After</h2><div class="pb-ba-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;"><div style="text-align: center;"><div style="background: #e0e0e0; border-radius: 0.75rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999; margin-bottom: 0.75rem;">Before</div><p style="font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Before</p></div><div style="text-align: center;"><div style="background: #d0d0d0; border-radius: 0.75rem; height: 300px; display: flex; align-items: center; justify-content: center; color: #999; margin-bottom: 0.75rem;">After</div><p style="font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">After</p></div></div></div></section>',
                'css_template' => '@media (max-width: 768px) { .pb-ba-grid { grid-template-columns: 1fr !important; } }',
                'is_active' => true,
                'is_custom' => false,
                'sort_order' => 3,
            ],
        ];
    }
}
