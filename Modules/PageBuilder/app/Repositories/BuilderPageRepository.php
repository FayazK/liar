<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Repositories;

use Modules\PageBuilder\Models\BuilderPage;

class BuilderPageRepository implements BuilderPageRepositoryInterface
{
    public function findByPostId(int $postId): ?BuilderPage
    {
        return BuilderPage::where('post_id', $postId)->first();
    }

    public function create(array $data): BuilderPage
    {
        return BuilderPage::create($data);
    }

    public function update(int $id, array $data): BuilderPage
    {
        $builderPage = BuilderPage::findOrFail($id);
        $builderPage->update($data);

        return $builderPage;
    }

    public function deleteByPostId(int $postId): bool
    {
        return BuilderPage::where('post_id', $postId)->delete() > 0;
    }
}
