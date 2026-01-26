<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly MediaService $mediaService
    ) {}

    public function createUser(array $data): User
    {
        $userData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'role_id' => $data['role_id'] ?? null,
            'password' => Hash::make($data['password']),
            'timezone_id' => $data['timezone_id'] ?? null,
            'language_id' => $data['language_id'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        $user = $this->userRepository->create($userData);

        event(new Registered($user));

        return $user;
    }

    public function updateProfile(int $userId, array $data): User
    {
        $updateData = [];

        $allowedFields = [
            'first_name', 'last_name', 'email', 'role_id', 'phone',
            'date_of_birth', 'bio', 'timezone_id', 'language_id',
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($data['email']) && $data['email'] !== $this->userRepository->find($userId)?->email) {
            $updateData['email_verified_at'] = null;
        }

        return $this->userRepository->update($userId, $updateData);
    }

    /**
     * Update user's avatar.
     */
    public function updateAvatar(User $user, UploadedFile $file): User
    {
        $this->mediaService->addMedia($user, $file, 'avatar');

        return $user->fresh();
    }

    /**
     * Remove user's avatar.
     */
    public function removeAvatar(User $user): User
    {
        $this->mediaService->clearCollection($user, 'avatar');

        return $user->fresh();
    }
}
