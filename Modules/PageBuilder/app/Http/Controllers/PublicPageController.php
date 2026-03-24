<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\View\View;
use Modules\PageBuilder\Services\PageBuilderService;

class PublicPageController extends Controller
{
    public function __construct(
        private readonly PageBuilderService $pageBuilderService,
    ) {}

    public function show(string $slug): View
    {
        $post = $this->pageBuilderService->findPublishedBuilderPage($slug);

        if ($post === null) {
            abort(404);
        }

        $builderPage = $post->builderPage;

        if ($builderPage === null || ! $builderPage->isCompiled()) {
            abort(404);
        }

        return view('page-builder::page', [
            'post' => $post,
            'builderPage' => $builderPage,
        ]);
    }
}
