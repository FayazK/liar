<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('timezone_id')->nullable()->change();
            $table->unsignedBigInteger('language_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set default values for NULL entries before making columns NOT NULL
        $defaultTimezoneId = DB::table('timezones')->where('code', 'UTC')->value('id') ?? 1;
        $defaultLanguageId = DB::table('languages')->where('code', 'en')->value('id') ?? 1;

        DB::table('users')->whereNull('timezone_id')->update(['timezone_id' => $defaultTimezoneId]);
        DB::table('users')->whereNull('language_id')->update(['language_id' => $defaultLanguageId]);

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('timezone_id')->nullable(false)->change();
            $table->unsignedBigInteger('language_id')->nullable(false)->change();
        });
    }
};
