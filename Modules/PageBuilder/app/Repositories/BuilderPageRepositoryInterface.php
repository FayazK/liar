<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BuilderPage;

interface BuilderPageRepositoryInterface
{
    public function findByPostId(int $postId): ?BuilderPage;

    public function create(array $data): BuilderPage;

    public function update(int $id, array $data): BuilderPage;

    public function deleteByPostId(int $postId): bool;
}
