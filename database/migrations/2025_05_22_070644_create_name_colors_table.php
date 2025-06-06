<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    //Create table
    public function up(): void
    {
        Schema::create('name_colors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name', 255);
            $table->string('color', 50);
        });
    }

    // Drop table
    public function down(): void
    {
        Schema::dropIfExists('name_colors');
    }
};
