<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\UserStoreRequest;
use App\Http\Requests\Api\V1\UserUpdateRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends ApiController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly UserRepository $userRepository
    ) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $this->getPerPage($request);

        $users = $this->userRepository->paginate(
            perPage: $perPage,
            with: ['role']
        );

        return response()->json([
            'data' => UserResource::collection($users),
            'message' => 'Users retrieved successfully',
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(UserStoreRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());
        $user->load('role');

        return $this->created(
            UserResource::make($user),
            'User created successfully'
        );
    }

    /**
     * Display the specified user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userRepository->findOrFail($id, ['role']);

        return $this->success(
            UserResource::make($user),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified user.
     */
    public function update(UserUpdateRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->updateProfile($id, $request->validated());
        $user->load('role');

        return $this->success(
            UserResource::make($user),
            'User updated successfully'
        );
    }

    /**
     * Remove the specified user.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = $this->userRepository->findOrFail($id);

        // Prevent deleting the authenticated user
        if ($user->id === auth()->id()) {
            return $this->forbidden('You cannot delete your own account');
        }

        $this->userRepository->delete($id);

        return $this->noContent();
    }
}
