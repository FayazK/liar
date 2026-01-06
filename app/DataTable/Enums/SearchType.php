<?php

declare(strict_types=1);

namespace App\DataTable\Enums;

/**
 * Types of search operations supported by the DataTable system.
 */
enum SearchType: string
{
    case Like = 'like';
    case FullText = 'fulltext';
}
