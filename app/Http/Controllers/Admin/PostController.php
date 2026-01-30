<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Aliziodev\LaravelTaxonomy\Facades\Taxonomy;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostDataTableRequest;
use App\Http\Requests\Admin\PostStoreRequest;
use App\Http\Requests\Admin\PostUpdateRequest;
use App\Http\Resources\Admin\PostCollection;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use App\Models\User;
use App\Queries\PostDataTableQueryService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(
        private readonly PostService $postService
    ) {}

    /**
     * Display a listing of posts.
     */
    public function index(string $type): Response
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null) {
            abort(404);
        }

        return Inertia::render('admin/posts/index', [
            'postType' => $postType->value,
            'postTypeLabel' => $postType->pluralLabel(),
        ]);
    }

    /**
     * Get paginated posts data for DataTable.
     */
    public function data(PostDataTableRequest $request, string $type): PostCollection
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null) {
            abort(404);
        }

        $query = Post::query()
            ->with(['author', 'taxonomies', 'media'])
            ->ofType($postType);

        $paginatedPosts = (new PostDataTableQueryService($query, $request))->getResults();

        return new PostCollection($paginatedPosts);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(string $type): Response
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null) {
            abort(404);
        }

        $typeConfig = config("post_types.types.{$postType->value}", []);
        $supports = $typeConfig['supports'] ?? [];

        return Inertia::render('admin/posts/create', [
            'postType' => $postType->value,
            'postTypeLabel' => $postType->label(),
            'supports' => $supports,
            'categories' => in_array('categories', $supports, true)
                ? $this->getCategoriesTree()
                : [],
            'tags' => in_array('tags', $supports, true)
                ? $this->getTagsList()
                : [],
            'authors' => $this->getAuthorsList(),
        ]);
    }

    /**
     * Show the form for editing a post.
     */
    public function edit(Post $post, string $type): Response
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null || $post->type !== $postType) {
            abort(404);
        }

        $post->load(['author', 'taxonomies', 'media']);

        $typeConfig = config("post_types.types.{$postType->value}", []);
        $supports = $typeConfig['supports'] ?? [];

        return Inertia::render('admin/posts/edit', [
            'post' => new PostResource($post),
            'postType' => $postType->value,
            'postTypeLabel' => $postType->label(),
            'supports' => $supports,
            'categories' => in_array('categories', $supports, true)
                ? $this->getCategoriesTree()
                : [],
            'tags' => in_array('tags', $supports, true)
                ? $this->getTagsList()
                : [],
            'authors' => $this->getAuthorsList(),
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(PostStoreRequest $request, string $type): JsonResponse
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null) {
            abort(404);
        }

        $post = $this->postService->createPost($request->validated(), $postType);

        return response()->json([
            'message' => "{$postType->label()} created successfully",
            'data' => new PostResource($post->load(['author', 'taxonomies', 'media'])),
        ], 201);
    }

    /**
     * Update the specified post.
     */
    public function update(PostUpdateRequest $request, Post $post, string $type): JsonResponse
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null || $post->type !== $postType) {
            abort(404);
        }

        $updatedPost = $this->postService->updatePost($post->id, $request->validated());

        return response()->json([
            'message' => "{$postType->label()} updated successfully",
            'data' => new PostResource($updatedPost),
        ]);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post, string $type): JsonResponse
    {
        $postType = PostType::fromRouteKey($type);

        if ($postType === null || $post->type !== $postType) {
            abort(404);
        }

        $this->postService->deletePost($post->id);

        return response()->json([
            'message' => "{$postType->label()} deleted successfully",
        ]);
    }

    /**
     * Get hierarchical categories for tree select.
     */
    private function getCategoriesTree(): array
    {
        $categoryType = config('post_types.taxonomy_types.categories', 'post_categories');

        return Taxonomy::tree($categoryType)->toArray();
    }

    /**
     * Get flat tags list.
     */
    private function getTagsList(): array
    {
        $tagType = config('post_types.taxonomy_types.tags', 'post_tags');

        return Taxonomy::findByType($tagType)
            ->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])
            ->toArray();
    }

    /**
     * Get authors list for select.
     */
    private function getAuthorsList(): array
    {
        return User::query()
            ->where('is_active', true)
            ->orderBy('first_name')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->full_name,
                'avatar_thumb_url' => $user->avatar_thumb_url,
            ])
            ->toArray();
    }
}
