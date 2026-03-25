<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PageBuilder\Http\Requests\SectionTemplateDataTableRequest;
use Modules\PageBuilder\Http\Requests\StoreSectionTemplateRequest;
use Modules\PageBuilder\Http\Requests\UpdateSectionTemplateRequest;
use Modules\PageBuilder\Models\SectionTemplate;
use Modules\PageBuilder\Queries\SectionTemplateDataTableQueryService;
use Modules\PageBuilder\Services\SectionTemplateService;

class SectionTemplateController extends Controller
{
    public function __construct(
        private readonly SectionTemplateService $service,
    ) {}

    public function index(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/templates/index', [
            'tags' => fn () => $this->service->getAllTags(),
            'categories' => fn () => SectionTemplate::query()
                ->select('category')
                ->distinct()
                ->pluck('category'),
        ]);
    }

    public function data(SectionTemplateDataTableRequest $request): ResourceCollection
    {
        $query = SectionTemplate::query();
        $paginated = (new SectionTemplateDataTableQueryService($query, $request))->getResults();

        return new ResourceCollection($paginated);
    }

    public function store(StoreSectionTemplateRequest $request): JsonResponse
    {
        $template = $this->service->createFromEditor(
            name: $request->validated('name'),
            category: $request->validated('category'),
            htmlTemplate: $request->validated('html_template'),
            cssTemplate: $request->validated('css_template') ?? '',
            tags: $request->validated('tags') ?? [],
        );

        return response()->json([
            'message' => 'Template created',
            'data' => $template,
        ], 201);
    }

    public function update(UpdateSectionTemplateRequest $request, SectionTemplate $template): JsonResponse
    {
        $updated = $this->service->updateTemplate($template->id, $request->validated());

        return response()->json([
            'message' => 'Template updated',
            'data' => $updated,
        ]);
    }

    public function destroy(SectionTemplate $template): JsonResponse
    {
        if (! $template->is_custom) {
            return response()->json(['message' => 'Cannot delete built-in templates'], 403);
        }

        $this->service->deleteTemplate($template->id);

        return response()->json(['message' => 'Template deleted']);
    }
}
