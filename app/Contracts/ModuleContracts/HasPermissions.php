<?php

declare(strict_types=1);

namespace App\Contracts\ModuleContracts;

interface HasPermissions
{
    /**
     * Return permissions registered by this module.
     *
     * @return array<string, array<int, string>> Group name => list of permission slugs
     */
    public static function permissions(): array;
}
