<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\Admin\PageBuilderController;
use Modules\PageBuilder\Http\Controllers\Admin\SectionTemplateController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/page-builder')
    ->name('admin.page-builder.')
    ->group(function () {
        Route::get('/', [PageBuilderController::class, 'index'])->name('index');
        Route::get('/create', [PageBuilderController::class, 'create'])->name('create');
        Route::post('/', [PageBuilderController::class, 'store'])->name('store');
        Route::get('/{post}/editor', [PageBuilderController::class, 'editor'])->name('editor');
        Route::put('/{post}', [PageBuilderController::class, 'update'])->name('update');
        Route::post('/{post}/publish', [PageBuilderController::class, 'publish'])->name('publish');
        Route::delete('/{post}', [PageBuilderController::class, 'destroy'])->name('destroy');

        Route::get('/templates', [SectionTemplateController::class, 'index'])->name('templates.index');
        Route::post('/templates', [SectionTemplateController::class, 'store'])->name('templates.store');
        Route::put('/templates/{template}', [SectionTemplateController::class, 'update'])->name('templates.update');
        Route::delete('/templates/{template}', [SectionTemplateController::class, 'destroy'])->name('templates.destroy');
    });
