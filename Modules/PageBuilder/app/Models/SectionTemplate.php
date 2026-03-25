<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SectionTemplate extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'category',
        'thumbnail',
        'grapes_data',
        'html_template',
        'css_template',
        'tags',
        'is_active',
        'is_custom',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'grapes_data' => 'array',
            'tags' => 'array',
            'is_active' => 'boolean',
            'is_custom' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Scope a query to only include active templates.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter templates by category.
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter templates by tag.
     */
    public function scopeByTag(Builder $query, string $tag): Builder
    {
        return $query->whereJsonContains('tags', $tag);
    }

    /**
     * Scope a query to only include custom templates.
     */
    public function scopeCustom(Builder $query): Builder
    {
        return $query->where('is_custom', true);
    }

    /**
     * Scope a query to only include built-in templates.
     */
    public function scopeBuiltIn(Builder $query): Builder
    {
        return $query->where('is_custom', false);
    }
}
