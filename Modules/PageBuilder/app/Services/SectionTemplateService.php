<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateService
{
    /** @return array<string, mixed> */
    public function getGroupedByCategory(): array
    {
        return Cache::remember('section_templates.grouped', 3600, function () {
            return SectionTemplate::query()
                ->active()
                ->select(['id', 'name', 'slug', 'category', 'thumbnail', 'html_template', 'css_template', 'sort_order'])
                ->orderBy('sort_order')
                ->get()
                ->groupBy('category')
                ->toArray();
        });
    }

    public function getActive(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();
    }

    public function getByCategory(string $category): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->byCategory($category)
            ->orderBy('sort_order')
            ->get();
    }
}
