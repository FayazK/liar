<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\SectionTemplate;

interface SectionTemplateRepositoryInterface
{
    public function create(array $data): SectionTemplate;

    public function update(int $id, array $data): SectionTemplate;

    public function delete(int $id): void;

    public function findById(int $id): ?SectionTemplate;

    public function getByTag(string $tag): Collection;

    public function getCustomTemplates(): Collection;

    public function getAllActive(): Collection;
}
