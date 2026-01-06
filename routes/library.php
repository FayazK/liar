<?php

declare(strict_types=1);

use App\Http\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('library')->name('library.')->group(function (): void {
    // API routes (must be before the catch-all index route)
    Route::prefix('api')->name('api.')->group(function (): void {
        // Folder tree routes
        Route::get('/folder-tree', [LibraryController::class, 'getFolderTree'])->name('folder-tree');
        Route::get('/folder-children/{id}', [LibraryController::class, 'getFolderChildren'])->name('folder-children');

        // Quick access routes
        Route::get('/quick-access/{category}', [LibraryController::class, 'getQuickAccessFiles'])->name('quick-access');

        // Favorite toggle
        Route::post('/favorite', [LibraryController::class, 'toggleFavorite'])->name('favorite');

        // Existing routes
        Route::get('/{id}/items', [LibraryController::class, 'getItems'])->name('items');
        Route::post('/store', [LibraryController::class, 'store'])->name('store');
        Route::patch('/{id}', [LibraryController::class, 'update'])->name('update');
        Route::delete('/{id}', [LibraryController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/upload', [LibraryController::class, 'uploadFiles'])->name('upload');
        Route::get('/file/{mediaId}/download', [LibraryController::class, 'downloadFile'])->name('file.download');
        Route::delete('/file/{mediaId}', [LibraryController::class, 'deleteFile'])->name('file.delete');
        Route::post('/move', [LibraryController::class, 'move'])->name('move');
    });

    // Page route (catch-all, must be last)
    Route::get('/{folder?}', [LibraryController::class, 'index'])->name('index');
});
