<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PageBuilderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/index', [
            'message' => 'Page Builder module is working!',
        ]);
    }
}
