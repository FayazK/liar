<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleDataTableRequest;
use App\Http\Requests\Admin\RoleStoreRequest;
use App\Http\Requests\Admin\RoleUpdateRequest;
use App\Http\Resources\Admin\RoleCollection;
use App\Http\Resources\Admin\RoleResource;
use App\Models\Role;
use App\Queries\RoleDataTableQueryService;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(
        private readonly RoleService $roleService
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/roles/index');
    }

    public function create(): Response
    {
        return Inertia::render('admin/roles/create');
    }

    public function data(RoleDataTableRequest $request): RoleCollection
    {
        $query = Role::query()->withCount(['users', 'permissions']);
        $paginatedRoles = (new RoleDataTableQueryService($query, $request))->getResults();

        return new RoleCollection($paginatedRoles);
    }

    public function edit(Role $role): Response
    {
        $role->load('permissions');

        return Inertia::render('admin/roles/edit', [
            'role' => new RoleResource($role),
        ]);
    }

    public function store(RoleStoreRequest $request): JsonResponse
    {
        $role = $this->roleService->createRole($request->validated());

        return response()->json([
            'message' => 'Role created successfully',
            'data' => new RoleResource($role),
        ], 201);
    }

    public function update(RoleUpdateRequest $request, Role $role): JsonResponse
    {
        $updatedRole = $this->roleService->updateRole($role->id, $request->validated());

        return response()->json([
            'message' => 'Role updated successfully',
            'data' => new RoleResource($updatedRole),
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->roleService->deleteRole($role->id);

        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }
}
