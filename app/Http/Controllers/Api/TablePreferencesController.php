<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TablePreferencesController extends Controller
{
    /**
     * Get table preferences for the authenticated user.
     */
    public function show(string $key): JsonResponse
    {
        $user = auth()->user();
        $metaKey = "datatable:{$key}";

        $preferences = $user->getMeta($metaKey);

        return response()->json([
            'data' => $preferences,
        ]);
    }

    /**
     * Save table preferences for the authenticated user.
     */
    public function store(Request $request, string $key): JsonResponse
    {
        $user = auth()->user();
        $metaKey = "datatable:{$key}";

        $preferences = $request->all();

        $user->setMeta($metaKey, $preferences);

        return response()->json([
            'success' => true,
        ]);
    }
}
