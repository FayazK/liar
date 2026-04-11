<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Database\Seeders\Templates;

interface TemplateCategoryInterface
{
    /** @return array<int, array<string, mixed>> */
    public static function templates(): array;
}
