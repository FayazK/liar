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
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        // Parse filters
        $filters = [];
        if ($request->has('is_active')) {
            $filters['is_active'] = $request->get('is_active');
        }
        if ($request->has('date_range')) {
            $filters['created_at'] = $request->get('date_range');
        }

        $paginatedUsers = $this->userService->getPaginatedUsers(
            $perPage,
            $search,
            $filters,
            $sortBy,
            $sortDirection
        );

        return new UserCollection($paginatedUsers);
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
