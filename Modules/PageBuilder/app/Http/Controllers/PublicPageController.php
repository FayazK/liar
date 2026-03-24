<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers;

use App\Http\Controllers\Controller;

class PublicPageController extends Controller
{
    public function show(string $slug): void
    {
        abort(404); // Implemented in Task 6
    }
}
