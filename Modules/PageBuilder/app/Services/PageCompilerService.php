<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Modules\PageBuilder\Models\BuilderPage;

class PageCompilerService
{
    public function compile(BuilderPage $builderPage): BuilderPage
    {
        $builderPage->update([
            'compiled_html' => '',
            'compiled_css' => '',
            'compiled_at' => now(),
        ]);

        return $builderPage->fresh();
    }
}
