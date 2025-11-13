<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppmp', function (Blueprint $table) {
            $table->id();
            $table->string('ppmp_no')->unique();
            $table->string('ppmp_ref')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status_plan')->default('indicative');
            $table->string('division')->nullable();
            $table->enum('status', ['close', 'utilized', 'process'])->default('process');
            $table->date('approved_date')->nullable();
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('allocated_budget', 15, 2)->default(0);
            $table->decimal('used_budget', 15, 2)->default(0);
            $table->decimal('remaining_budget', 15, 2)->default(0);
            $table->string('budget_status')->default('available');
            $table->timestamps();

            // Indexes for performance
            $table->index('user_id');
            $table->index('status_plan');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppmp');
    }
};
