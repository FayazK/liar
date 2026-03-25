<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

class SectionTemplateRepository implements SectionTemplateRepositoryInterface
{
    public function create(array $data): SectionTemplate
    {
        return SectionTemplate::create($data);
    }

    public function update(int $id, array $data): SectionTemplate
    {
        $template = SectionTemplate::findOrFail($id);
        $template->update($data);

        return $template->fresh();
    }

    public function delete(int $id): void
    {
        SectionTemplate::findOrFail($id)->delete();
    }

    public function findById(int $id): ?SectionTemplate
    {
        return SectionTemplate::find($id);
    }

    public function getByTag(string $tag): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->byTag($tag)
            ->orderBy('sort_order')
            ->get();
    }

    public function getCustomTemplates(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->custom()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();
    }

    public function getAllActive(): Collection
    {
        return SectionTemplate::query()
            ->active()
            ->select(['id', 'name', 'slug', 'category', 'thumbnail', 'html_template', 'css_template', 'tags', 'sort_order', 'is_custom'])
            ->orderBy('sort_order')
            ->get();
    }
}
