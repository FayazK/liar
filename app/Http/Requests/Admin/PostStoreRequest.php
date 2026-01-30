<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\PostStatus;
use App\Enums\PostType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'content' => ['nullable', 'array'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', Rule::enum(PostStatus::class)],
            'author_id' => ['required', 'integer', 'exists:users,id'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'published_at' => ['nullable', 'date'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:taxonomies,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:taxonomies,id'],
            'featured_image' => ['nullable', 'image', 'max:5120'], // 5MB max
        ];
    }

    /**
     * Get the post type from the route.
     */
    public function getPostType(): PostType
    {
        $typeKey = $this->route('type');

        return PostType::fromRouteKey($typeKey) ?? PostType::BlogPost;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and hyphens.',
            'featured_image.max' => 'The featured image may not be larger than 5MB.',
        ];
    }
}
