<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Repositories\SectionTemplateRepositoryInterface;

class SectionTemplateService
{
    public function __construct(
        private readonly SectionTemplateRepositoryInterface $repository,
    ) {}

    /** @return list<string> */
    public function getAllTags(): array
    {
        return $this->repository->getAllActive()
            ->pluck('tags')
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function getGroupedByCategory(?string $tag = null): array
    {
        $all = Cache::remember('section_templates.grouped', 3600, function () {
            return $this->repository->getAllActive();
        });

        if ($tag) {
            $all = $all->filter(fn (SectionTemplate $t): bool => in_array($tag, $t->tags ?? [], true));
        }

        return $all->groupBy('category')->toArray();
    }

    public function getActive(): Collection
    {
        return $this->repository->getAllActive();
    }

    public function getByCategory(string $category): Collection
    {
        return $this->repository->getAllActive()
            ->filter(fn (SectionTemplate $t): bool => $t->category === $category)
            ->values();
    }

    public function createFromEditor(
        string $name,
        string $category,
        string $htmlTemplate,
        string $cssTemplate = '',
        array $tags = [],
    ): SectionTemplate {
        $this->clearCache();

        $slug = Str::slug($name);
        if (SectionTemplate::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::random(4);
        }

        return $this->repository->create([
            'name' => $name,
            'slug' => $slug,
            'category' => $category,
            'html_template' => $htmlTemplate,
            'css_template' => $cssTemplate,
            'tags' => $tags,
            'is_custom' => true,
            'is_active' => true,
            'sort_order' => 0,
        ]);
    }

    public function updateTemplate(int $id, array $data): SectionTemplate
    {
        $this->clearCache();

        return $this->repository->update($id, $data);
    }

    public function deleteTemplate(int $id): void
    {
        $this->clearCache();
        $this->repository->delete($id);
    }

    private function clearCache(): void
    {
        Cache::forget('section_templates.grouped');
    }
}
