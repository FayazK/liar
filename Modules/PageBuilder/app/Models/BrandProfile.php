<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\PageBuilder\Database\Factories\BrandProfileFactory;

class BrandProfile extends Model
{
    use HasFactory;

    protected static function newFactory(): BrandProfileFactory
    {
        return BrandProfileFactory::new();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'business_name',
        'industry',
        'tone_of_voice',
        'target_audience',
        'color_palette',
        'font_preferences',
        'brand_description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'color_palette' => 'array',
            'font_preferences' => 'array',
        ];
    }
}
