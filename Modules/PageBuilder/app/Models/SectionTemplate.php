<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\PageBuilder\Database\Factories\SectionTemplateFactory;

class SectionTemplate extends Model
{
    use HasFactory;

    protected static function newFactory(): SectionTemplateFactory
    {
        return SectionTemplateFactory::new();
    }

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

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeByTag(Builder $query, string $tag): Builder
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function scopeCustom(Builder $query): Builder
    {
        return $query->where('is_custom', true);
    }

    public function scopeBuiltIn(Builder $query): Builder
    {
        return $query->where('is_custom', false);
    }
}
