<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\DropdownRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DropdownController extends Controller
{
    public function __construct(private readonly DropdownRepositoryInterface $dropdownRepository)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $results = $this->dropdownRepository->get($request->get('type'), $request->except('type'));

        return response()->json($results);
    }
}
