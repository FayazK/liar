<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\Admin\UserCollection;
use App\Http\Resources\UserDetailResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/users/index');
    }

    public function data(Request $request)
    {
        $users = $this->userService->getActiveUsers();

        return new UserCollection($users);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->findUser($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(new UserDetailResource($user));
    }

    public function edit(int $id): Response
    {
        $user = $this->userService->findUser($id);

        if (!$user) {
            abort(404, 'User not found');
        }

        return Inertia::render('admin/users/edit', [
            'user' => new UserDetailResource($user)
        ]);
    }

    public function store(UserStoreRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'message' => 'User created successfully',
            'data' => new UserDetailResource($user)
        ], 201);
    }

    public function update(UserUpdateRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->updateProfile($id, $request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'data' => new UserDetailResource($user)
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userService->findUser($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $this->userService->deleteUser($id);

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}
