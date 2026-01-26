<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\TokenController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API v1 routes
Route::prefix('v1')->group(function () {
    // Public routes (no authentication required)
    Route::post('/auth/login', [LoginController::class, 'login'])->name('api.v1.auth.login');
    Route::post('/auth/register', [RegisterController::class, 'register'])->name('api.v1.auth.register');
    Route::post('/auth/password/forgot', [PasswordResetController::class, 'sendResetLink'])->name('api.v1.auth.password.forgot');
    Route::post('/auth/password/reset', [PasswordResetController::class, 'reset'])->name('api.v1.auth.password.reset');

    // Protected routes (authentication required)
    Route::middleware('auth:sanctum')->group(function () {
        // Authentication
        Route::post('/auth/logout', [LogoutController::class, 'logout'])->name('api.v1.auth.logout');
        Route::post('/auth/refresh', [TokenController::class, 'refresh'])->name('api.v1.auth.refresh');
        Route::get('/auth/user', [TokenController::class, 'user'])->name('api.v1.auth.user');

        // Users
        Route::apiResource('users', UserController::class)->names([
            'index' => 'api.v1.users.index',
            'store' => 'api.v1.users.store',
            'show' => 'api.v1.users.show',
            'update' => 'api.v1.users.update',
            'destroy' => 'api.v1.users.destroy',
        ]);

        // Roles
        Route::apiResource('roles', RoleController::class)->only(['index', 'show'])->names([
            'index' => 'api.v1.roles.index',
            'show' => 'api.v1.roles.show',
        ]);
    });
});
