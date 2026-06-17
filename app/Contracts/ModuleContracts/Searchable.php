<?php

declare(strict_types=1);

namespace App\Contracts\ModuleContracts;

interface Searchable
{
    /**
     * Return search configuration for this module.
     *
     * @return array{model: class-string, fields: array<int, string>, label: string, route: string}
     */
    public static function searchConfig(): array;
}
