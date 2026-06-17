<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PageBuilder\Http\Requests\StoreBrandProfileRequest;
use Modules\PageBuilder\Services\BrandProfileService;

class BrandProfileController extends Controller
{
    public function __construct(
        private readonly BrandProfileService $brandProfileService,
    ) {}

    public function edit(): Response
    {
        return Inertia::render('PageBuilder::admin/page-builder/brand-profile', [
            'brandProfile' => $this->brandProfileService->getActive(),
        ]);
    }

    public function update(StoreBrandProfileRequest $request): RedirectResponse
    {
        $this->brandProfileService->save($request->validated());

        return redirect()->back()->with('success', 'Brand profile saved successfully.');
    }
}
