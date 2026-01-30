<?php

declare(strict_types=1);

namespace App\Enums;

enum PostType: string
{
    case BlogPost = 'blog_post';
    case Page = 'page';

    /**
     * Get the human-readable label for the post type.
     */
    public function label(): string
    {
        return match ($this) {
            self::BlogPost => 'Blog Post',
            self::Page => 'Page',
        };
    }

    /**
     * Get the plural label for the post type.
     */
    public function pluralLabel(): string
    {
        return match ($this) {
            self::BlogPost => 'Blog Posts',
            self::Page => 'Pages',
        };
    }

    /**
     * Get the route key for the post type.
     */
    public function routeKey(): string
    {
        return match ($this) {
            self::BlogPost => 'blog-post',
            self::Page => 'page',
        };
    }

    /**
     * Create from route key.
     */
    public static function fromRouteKey(string $key): ?self
    {
        return match ($key) {
            'blog-post' => self::BlogPost,
            'page' => self::Page,
            default => null,
        };
    }
}
