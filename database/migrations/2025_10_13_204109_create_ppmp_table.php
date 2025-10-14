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
        Schema::create('ppmp', function (Blueprint $table) {
            $table->id();
            $table->string('ppmp_no')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status_plan')->default('indicative');
            $table->string('division');
            $table->enum('status', ['close','utilized','process'])->default('process');
            $table->date('approved_date')->nullable();
            $table->decimal('total', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp');
    }
};
