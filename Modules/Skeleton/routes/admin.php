<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\Skeleton\Http\Controllers\Admin\SkeletonController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/skeleton')
    ->name('admin.skeleton.')
    ->group(function () {
        Route::get('/', [SkeletonController::class, 'index'])->name('index');
    });
