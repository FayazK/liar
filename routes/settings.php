<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function (): void {
    // Main account page with tabs
    Route::get('settings/account', [ProfileController::class, 'edit'])->name('account');

    // Redirect old URLs to account page with appropriate tab hash
    Route::redirect('settings', '/settings/account');
    Route::redirect('settings/profile', '/settings/account#profile');
    Route::redirect('settings/password', '/settings/account#password');
    Route::redirect('settings/appearance', '/settings/account#appearance');

    // Form submission routes (keep existing for form actions)
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Avatar routes
    Route::post('settings/avatar', [ProfileController::class, 'updateAvatar'])->name('avatar.update');
    Route::delete('settings/avatar', [ProfileController::class, 'destroyAvatar'])->name('avatar.destroy');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');
});
