<?php

declare(strict_types=1);

namespace Modules\Skeleton\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SkeletonController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Skeleton::admin/skeleton/index', [
            'message' => 'Skeleton module is working!',
        ]);
    }
}
