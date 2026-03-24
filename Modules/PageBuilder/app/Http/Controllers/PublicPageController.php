<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\View\View;

class PublicPageController extends Controller
{
    public function show(string $slug): View
    {
        $post = Post::query()
            ->where('slug', $slug)
            ->where('type', 'page')
            ->where('editor_mode', 'builder')
            ->published()
            ->with('builderPage')
            ->firstOrFail();

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
