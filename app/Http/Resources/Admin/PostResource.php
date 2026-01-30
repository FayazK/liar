<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'author_id' => $this->author_id,
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'full_name' => $this->author->full_name,
                'avatar_thumb_url' => $this->author->avatar_thumb_url,
            ]),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'featured_image_url' => $this->featured_image_url,
            'featured_image_thumb_url' => $this->featured_image_thumb_url,
            'category_ids' => $this->whenLoaded('taxonomies', fn () => $this->categories()->pluck('id')),
            'tag_ids' => $this->whenLoaded('taxonomies', fn () => $this->tags()->pluck('id')),
            'categories' => $this->whenLoaded('taxonomies', fn () => $this->categories()->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
            ])),
            'tags' => $this->whenLoaded('taxonomies', fn () => $this->tags()->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])),
            'supports' => [
                'categories' => $this->supports('categories'),
                'tags' => $this->supports('tags'),
                'featured_image' => $this->supports('featured_image'),
                'excerpt' => $this->supports('excerpt'),
                'seo' => $this->supports('seo'),
                'author' => $this->supports('author'),
            ],
            'is_published' => $this->isPublished(),
            'is_draft' => $this->isDraft(),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
