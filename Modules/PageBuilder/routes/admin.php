<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\Admin\PageBuilderController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/page-builder')
    ->name('admin.page-builder.')
    ->group(function () {
        Route::get('/', [PageBuilderController::class, 'index'])->name('index');
    });
