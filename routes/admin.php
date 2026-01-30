<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index')->middleware('permission:users.view');
        Route::get('/data', [UserController::class, 'data'])->name('data')->middleware('permission:users.view');
        Route::get('/create', [UserController::class, 'create'])->name('create')->middleware('permission:users.create');
        Route::get('/{user}', [UserController::class, 'show'])->name('show')->middleware('permission:users.view');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit')->middleware('permission:users.update');
        Route::post('/', [UserController::class, 'store'])->name('store')->middleware('permission:users.create');
        Route::put('/{user}', [UserController::class, 'update'])->name('update')->middleware('permission:users.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->middleware('permission:users.delete');
    });

    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index')->middleware('permission:roles.view');
        Route::get('/data', [RoleController::class, 'data'])->name('data')->middleware('permission:roles.view');
        Route::get('/create', [RoleController::class, 'create'])->name('create')->middleware('permission:roles.create');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit')->middleware('permission:roles.update');
        Route::post('/', [RoleController::class, 'store'])->name('store')->middleware('permission:roles.create');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update')->middleware('permission:roles.update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy')->middleware('permission:roles.delete');
    });

    // Blog Posts routes
    Route::prefix('posts/blog-post')->name('posts.blog_post.')->group(function () {
        Route::get('/', [PostController::class, 'index'])->name('index')->middleware('permission:posts.view')->defaults('type', 'blog-post');
        Route::get('/data', [PostController::class, 'data'])->name('data')->middleware('permission:posts.view')->defaults('type', 'blog-post');
        Route::get('/create', [PostController::class, 'create'])->name('create')->middleware('permission:posts.create')->defaults('type', 'blog-post');
        Route::get('/{post}/edit', [PostController::class, 'edit'])->name('edit')->middleware('permission:posts.update')->defaults('type', 'blog-post');
        Route::post('/', [PostController::class, 'store'])->name('store')->middleware('permission:posts.create')->defaults('type', 'blog-post');
        Route::put('/{post}', [PostController::class, 'update'])->name('update')->middleware('permission:posts.update')->defaults('type', 'blog-post');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy')->middleware('permission:posts.delete')->defaults('type', 'blog-post');
    });

    // Pages routes
    Route::prefix('posts/page')->name('posts.page.')->group(function () {
        Route::get('/', [PostController::class, 'index'])->name('index')->middleware('permission:pages.view')->defaults('type', 'page');
        Route::get('/data', [PostController::class, 'data'])->name('data')->middleware('permission:pages.view')->defaults('type', 'page');
        Route::get('/create', [PostController::class, 'create'])->name('create')->middleware('permission:pages.create')->defaults('type', 'page');
        Route::get('/{post}/edit', [PostController::class, 'edit'])->name('edit')->middleware('permission:pages.update')->defaults('type', 'page');
        Route::post('/', [PostController::class, 'store'])->name('store')->middleware('permission:pages.create')->defaults('type', 'page');
        Route::put('/{post}', [PostController::class, 'update'])->name('update')->middleware('permission:pages.update')->defaults('type', 'page');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy')->middleware('permission:pages.delete')->defaults('type', 'page');
    });
});
