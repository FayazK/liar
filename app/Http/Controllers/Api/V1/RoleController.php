<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\Api\V1\RoleResource;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends ApiController
{
    public function __construct(
        private readonly RoleRepository $roleRepository
    ) {}

    /**
     * Display a listing of roles.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $this->getPerPage($request);

        $roles = $this->roleRepository->paginate(
            perPage: $perPage,
            with: ['permissions']
        );

        return response()->json([
            'data' => RoleResource::collection($roles),
            'message' => 'Roles retrieved successfully',
        ]);
    }

    /**
     * Display the specified role.
     */
    public function show(int $id): JsonResponse
    {
        $role = $this->roleRepository->findOrFail($id, ['permissions']);

        return $this->success(
            RoleResource::make($role),
            'Role retrieved successfully'
        );
    }
}
