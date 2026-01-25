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
        Schema::create('libraries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('libraries')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('color', 7)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'parent_id'], 'idx_user_parent');
            $table->index('slug', 'idx_slug');

            // Unique constraint: unique folder names per user per parent
            $table->unique(['user_id', 'parent_id', 'name'], 'unique_folder_name_per_parent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('libraries');
    }
};
