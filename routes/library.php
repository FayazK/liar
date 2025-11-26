<?php

declare(strict_types=1);

use App\Http\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('library')->name('library.')->group(function (): void {
    Route::get('/{folder?}', [LibraryController::class, 'index'])->name('index');
    Route::get('/api/{id}/items', [LibraryController::class, 'getItems'])->name('items');
    Route::post('/api/store', [LibraryController::class, 'store'])->name('store');
    Route::patch('/api/{id}', [LibraryController::class, 'update'])->name('update');
    Route::delete('/api/{id}', [LibraryController::class, 'destroy'])->name('destroy');
    Route::post('/api/{id}/upload', [LibraryController::class, 'uploadFiles'])->name('upload');
    Route::get('/api/file/{mediaId}/download', [LibraryController::class, 'downloadFile'])->name('file.download');
    Route::delete('/api/file/{mediaId}', [LibraryController::class, 'deleteFile'])->name('file.delete');
    Route::post('/api/move', [LibraryController::class, 'move'])->name('move');
});
