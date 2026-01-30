<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'type' => PostType::BlogPost,
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->generateContent(),
            'excerpt' => fake()->paragraph(),
            'status' => fake()->randomElement(PostStatus::cases()),
            'author_id' => User::factory(),
            'meta_title' => fake()->optional()->sentence(),
            'meta_description' => fake()->optional()->paragraph(),
            'published_at' => fake()->optional()->dateTimeBetween('-1 year', '+1 month'),
        ];
    }

    /**
     * Generate TipTap-compatible JSON content.
     *
     * @return array<string, mixed>
     */
    private function generateContent(): array
    {
        $paragraphs = fake()->paragraphs(fake()->numberBetween(3, 8));
        $content = [];

        foreach ($paragraphs as $paragraph) {
            $content[] = [
                'type' => 'paragraph',
                'content' => [
                    [
                        'type' => 'text',
                        'text' => $paragraph,
                    ],
                ],
            ];
        }

        return [
            'type' => 'doc',
            'content' => $content,
        ];
    }

    /**
     * Indicate that the post is a blog post.
     */
    public function blogPost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::BlogPost,
        ]);
    }

    /**
     * Indicate that the post is a page.
     */
    public function page(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Page,
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Draft,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Published,
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the post is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Archived,
        ]);
    }

    /**
     * Set the post author.
     */
    public function byAuthor(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'author_id' => $user->id,
        ]);
    }
}
