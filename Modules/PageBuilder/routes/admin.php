<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\PageBuilder\Http\Controllers\Admin\AiController;
use Modules\PageBuilder\Http\Controllers\Admin\BrandProfileController;
use Modules\PageBuilder\Http\Controllers\Admin\PageBuilderController;
use Modules\PageBuilder\Http\Controllers\Admin\SectionTemplateController;

Route::middleware(['web', 'auth', 'admin'])
    ->prefix('admin/page-builder')
    ->name('admin.page-builder.')
    ->group(function () {
        Route::get('/', [PageBuilderController::class, 'index'])->name('index');
        Route::get('/create', [PageBuilderController::class, 'create'])->name('create');
        Route::post('/', [PageBuilderController::class, 'store'])->name('store');

        Route::middleware('can:page-builder.ai.brand-profile')->group(function () {
            Route::get('/brand-profile', [BrandProfileController::class, 'edit'])->name('brand-profile.edit');
            Route::put('/brand-profile', [BrandProfileController::class, 'update'])->name('brand-profile.update');
        });

        // AI Generation routes
        Route::prefix('ai')->name('ai.')->middleware(['can:page-builder.ai.generate', 'throttle:10,1'])->group(function () {
            Route::post('/section', [AiController::class, 'generateSection'])->name('section');
            Route::post('/page', [AiController::class, 'generatePage'])->name('page');
            Route::post('/rewrite', [AiController::class, 'rewriteContent'])->name('rewrite');
            Route::post('/style-suggestions', [AiController::class, 'styleSuggestions'])->name('style');
            Route::post('/image', [AiController::class, 'generateImage'])->name('image');
        });

        Route::get('/{post}/editor', [PageBuilderController::class, 'editor'])->name('editor');
        Route::put('/{post}', [PageBuilderController::class, 'update'])->name('update');
        Route::post('/{post}/publish', [PageBuilderController::class, 'publish'])->name('publish');
        Route::delete('/{post}', [PageBuilderController::class, 'destroy'])->name('destroy');

        Route::get('/templates', [SectionTemplateController::class, 'index'])->name('templates.index');
        Route::get('/templates/data', [SectionTemplateController::class, 'data'])->name('templates.data');
        Route::post('/templates', [SectionTemplateController::class, 'store'])->name('templates.store');
        Route::put('/templates/{template}', [SectionTemplateController::class, 'update'])->name('templates.update');
        Route::delete('/templates/{template}', [SectionTemplateController::class, 'destroy'])->name('templates.destroy');
    });
