<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleStoreRequest;
use App\Http\Requests\Admin\RoleUpdateRequest;
use App\Http\Resources\Admin\RoleResource;
use App\Models\Role;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(
        private readonly RoleRepository $roleRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/roles/index');
    }

    public function create(): Response
    {
        return Inertia::render('admin/roles/create');
    }

    public function data(): JsonResponse
    {
        $roles = $this->roleRepository->getAll()->loadCount('users');

        return response()->json([
            'data' => RoleResource::collection($roles),
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/edit', [
            'role' => new RoleResource($role),
        ]);
    }

    public function store(RoleStoreRequest $request): JsonResponse
    {
        $role = $this->roleRepository->create($request->validated());

        return response()->json([
            'message' => 'Role created successfully',
            'data' => new RoleResource($role),
        ], 201);
    }

    public function update(RoleUpdateRequest $request, Role $role): JsonResponse
    {
        $updatedRole = $this->roleRepository->update($role->id, $request->validated());

        return response()->json([
            'message' => 'Role updated successfully',
            'data' => new RoleResource($updatedRole),
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->roleRepository->delete($role->id);

        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }
}
