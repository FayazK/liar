<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use App\Enums\EditorMode;
use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Database\Eloquent\Collection;
use Modules\PageBuilder\Models\BuilderPage;
use Modules\PageBuilder\Repositories\BuilderPageRepositoryInterface;

class PageBuilderService
{
    public function __construct(
        private readonly BuilderPageRepositoryInterface $builderPageRepository,
        private readonly PostService $postService,
        private readonly PageCompilerService $compilerService,
    ) {}

    public function getBuilderPages(): Collection
    {
        return Post::query()
            ->select(['id', 'title', 'slug', 'status', 'editor_mode', 'updated_at', 'author_id'])
            ->where('editor_mode', EditorMode::Builder)
            ->ofType(PostType::Page)
            ->with('author:id,first_name,last_name')
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function createPage(array $data): Post
    {
        return $this->postService->createPost(
            [
                'title' => $data['title'],
                'slug' => $data['slug'] ?? '',
                'status' => PostStatus::Draft->value,
                'editor_mode' => EditorMode::Builder->value,
                'content' => null,
            ],
            PostType::Page,
        );
    }

    public function saveEditorState(int $postId, array $grapesData, string $grapesCss): BuilderPage
    {
        $existing = $this->builderPageRepository->findByPostId($postId);

        if ($existing) {
            $existing->update([
                'grapes_data' => $grapesData,
                'grapes_css' => $grapesCss,
            ]);

            return $existing;
        }

        return $this->builderPageRepository->create([
            'post_id' => $postId,
            'grapes_data' => $grapesData,
            'grapes_css' => $grapesCss,
        ]);
    }

    public function publishPage(int $postId): Post
    {
        $builderPage = $this->builderPageRepository->findByPostId($postId);

        if ($builderPage === null) {
            throw new \RuntimeException('No builder page data found for post '.$postId);
        }

        $this->compilerService->compile($builderPage);
        $this->postService->publishPost($postId);

        return Post::with('builderPage')->findOrFail($postId);
    }

    public function getBuilderPage(int $postId): ?BuilderPage
    {
        return $this->builderPageRepository->findByPostId($postId);
    }

    public function findPublishedBuilderPage(string $slug): ?Post
    {
        return Post::query()
            ->where('slug', $slug)
            ->where('editor_mode', EditorMode::Builder)
            ->ofType(PostType::Page)
            ->published()
            ->with('builderPage')
            ->first();
    }

    public function deletePage(int $postId): bool
    {
        return $this->postService->deletePost($postId);
    }
}
