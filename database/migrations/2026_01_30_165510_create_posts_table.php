<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50)->index();
            $table->string('title', 255);
            $table->string('slug', 255);
            $table->json('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('status', 20)->index();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            // Composite unique constraint for slug within type
            $table->unique(['slug', 'type', 'deleted_at'], 'posts_slug_type_deleted_unique');

            // Composite indexes for common queries
            $table->index(['type', 'status', 'published_at']);
            $table->index(['author_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
