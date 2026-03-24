<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateService
{
    /** @return array<string, Collection> */
    public function getGroupedByCategory(): array
    {
        return SectionTemplate::query()
            ->active()
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category')
            ->toArray();
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
