<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'phone' => fake()->optional()->phoneNumber(),
            'date_of_birth' => fake()->optional()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'avatar' => fake()->optional()->imageUrl(200, 200, 'people'),
            'bio' => fake()->optional()->paragraph(),
            'timezone' => fake()->randomElement(['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']),
            'locale' => fake()->randomElement(['en', 'es', 'fr', 'de', 'ja']),
            'is_active' => fake()->boolean(90), // 90% chance of being active
            'last_login_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
