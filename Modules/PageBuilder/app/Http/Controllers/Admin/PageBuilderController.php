<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PageBuilder\Http\Requests\StorePageRequest;
use Modules\PageBuilder\Http\Requests\UpdatePageRequest;
use Modules\PageBuilder\Services\PageBuilderService;
use Modules\PageBuilder\Services\SectionTemplateService;

class PageBuilderController extends Controller
{
    public function __construct(
        private readonly PageBuilderService $pageBuilderService,
        private readonly SectionTemplateService $sectionTemplateService,
    ) {}

    public function index(): Response
    {
        $pages = Post::query()
            ->where('editor_mode', 'builder')
            ->where('type', 'page')
            ->with('author')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('PageBuilder::admin/page-builder/index', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/create');
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $post = $this->pageBuilderService->createPage($request->validated());

        return response()->json([
            'message' => 'Page created successfully',
            'data' => $post,
        ], 201);
    }

    public function editor(Post $post): Response
    {
        $builderPage = $this->pageBuilderService->getBuilderPage($post->id);
        $templates = $this->sectionTemplateService->getGroupedByCategory();

        return Inertia::render('PageBuilder::admin/page-builder/editor', [
            'post' => $post,
            'builderPage' => $builderPage,
            'sectionTemplates' => $templates,
        ]);
    }

    public function update(UpdatePageRequest $request, Post $post): JsonResponse
    {
        $builderPage = $this->pageBuilderService->saveEditorState(
            $post->id,
            $request->validated('grapes_data'),
            $request->validated('grapes_css', ''),
        );

        return response()->json([
            'message' => 'Saved',
            'data' => $builderPage,
        ]);
    }

    public function publish(Post $post): JsonResponse
    {
        $post = $this->pageBuilderService->publishPage($post->id);

        return response()->json([
            'message' => 'Page published',
            'data' => $post,
        ]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(['message' => 'Page deleted']);
    }
}
