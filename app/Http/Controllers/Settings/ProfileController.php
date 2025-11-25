<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\AvatarUpdateRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Services\UserService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * Show the user's account settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/account', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $this->userService->updateProfile($request->user()->id, $request->validated());

        return to_route('account');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $userId = $request->user()->id;

        Auth::logout();

        $this->userService->deleteUser($userId);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Update the user's avatar.
     */
    public function updateAvatar(AvatarUpdateRequest $request): JsonResponse
    {
        $user = $this->userService->updateAvatar(
            $request->user(),
            $request->file('avatar')
        );

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $user->avatar_url,
            'avatar_thumb_url' => $user->avatar_thumb_url,
        ]);
    }

    /**
     * Remove the user's avatar.
     */
    public function destroyAvatar(Request $request): JsonResponse
    {
        $user = $this->userService->removeAvatar($request->user());

        return response()->json([
            'message' => 'Avatar removed successfully',
            'avatar_url' => $user->avatar_url,
            'avatar_thumb_url' => $user->avatar_thumb_url,
        ]);
    }
}
