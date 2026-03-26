<?php

declare(strict_types=1);

namespace App\Enums;

enum EditorMode: string
{
    case Tiptap = 'tiptap';
    case Builder = 'builder';
}
