<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('industry')->nullable();
            $table->string('tone_of_voice')->default('professional');
            $table->text('target_audience')->nullable();
            $table->json('color_palette')->nullable();
            $table->json('font_preferences')->nullable();
            $table->text('brand_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_profiles');
    }
};
