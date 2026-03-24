<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::middleware(['web'])
    ->prefix(config('page-builder.public_route_prefix', 'p'))
    ->name('page-builder.public.')
    ->group(function () {
        Route::get('/{slug}', [\Modules\PageBuilder\Http\Controllers\PublicPageController::class, 'show'])->name('show');
    });
