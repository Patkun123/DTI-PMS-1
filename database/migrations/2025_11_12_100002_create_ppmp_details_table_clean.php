<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppmp_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppmp_id')->constrained('ppmp')->onDelete('cascade');
            $table->text('general_description');
            $table->string('ppmp_code')->nullable();
            $table->string('source_funds')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index('ppmp_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppmp_details');
    }
};
