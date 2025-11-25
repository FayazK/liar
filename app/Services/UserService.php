<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private MediaService $mediaService
    ) {}

    public function createUser(array $data): User
    {
        $userData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'timezone' => $data['timezone'] ?? 'UTC',
            'locale' => $data['locale'] ?? 'en',
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
            'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'bio', 'timezone', 'locale',
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

    public function deleteUser(int $userId): bool
    {
        return $this->userRepository->delete($userId);
    }

    public function findUser(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    public function findUserByEmail(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }

    public function updateLastLogin(int $userId): User
    {
        return $this->userRepository->updateLastLogin($userId);
    }

    public function getActiveUsers()
    {
        return $this->userRepository->getActiveUsers();
    }

    public function getPaginatedUsers(
        int $perPage = 15,
        ?string $search = null,
        ?array $filters = null,
        ?string $sortBy = 'created_at',
        string $sortDirection = 'desc'
    ): LengthAwarePaginator {
        return $this->userRepository->paginateUsers(
            $perPage,
            $search,
            $filters,
            $sortBy,
            $sortDirection
        );
    }

    public function isEmailTaken(string $email): bool
    {
        return $this->userRepository->existsByEmail($email);
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
