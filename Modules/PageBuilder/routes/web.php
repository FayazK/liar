<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::middleware(['web'])
    ->group(function () {
        // Public page routes will be registered here
    });
