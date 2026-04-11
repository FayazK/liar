<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\PublicPageController;

Route::middleware(['web'])
    ->prefix(config('page-builder.public_route_prefix', 'p'))
    ->name('page-builder.public.')
    ->group(function () {
        Route::get('/{slug}', [PublicPageController::class, 'show'])->name('show');
    });
