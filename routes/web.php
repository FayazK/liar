<?php

use App\Http\Controllers\Api\TablePreferencesController;
use App\Http\Controllers\DropdownController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('test-dropdown', function () {
        return Inertia::render('test-dropdown');
    })->name('test-dropdown');

    Route::get('dropdown', DropdownController::class)->name('dropdown');

    // Table preferences API
    Route::get('api/table-preferences/{key}', [TablePreferencesController::class, 'show'])
        ->name('api.table-preferences.show');
    Route::post('api/table-preferences/{key}', [TablePreferencesController::class, 'store'])
        ->name('api.table-preferences.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/library.php';
