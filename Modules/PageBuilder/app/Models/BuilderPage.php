<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Models;

use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuilderPage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'post_id',
        'grapes_data',
        'grapes_css',
        'compiled_html',
        'compiled_css',
        'compiled_at',
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
            'compiled_at' => 'datetime',
        ];
    }

    /**
     * Get the post that owns this builder page.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Check if the page has been compiled.
     */
    public function isCompiled(): bool
    {
        return $this->compiled_at !== null && $this->compiled_html !== null;
    }
}
