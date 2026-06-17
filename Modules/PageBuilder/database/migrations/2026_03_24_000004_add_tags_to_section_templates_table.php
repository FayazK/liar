<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('section_templates', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('category');
            $table->boolean('is_custom')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('section_templates', function (Blueprint $table) {
            $table->dropColumn(['tags', 'is_custom']);
        });
    }
};
