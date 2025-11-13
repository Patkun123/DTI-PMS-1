<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->string('pr_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('ppmp_id')->nullable()->constrained('ppmp')->onDelete('set null');
            $table->text('purpose')->nullable();
            $table->string('division')->nullable();
            $table->enum('status', ['ongoing', 'approved', 'cancelled', 'completed'])->default('ongoing');
            $table->date('approved_date')->nullable();
            $table->date('requested_date');
            $table->string('ris_status')->default('none');
            $table->string('ris_number')->nullable()->unique();
            $table->timestamps();

            // Indexes for performance
            $table->index('user_id');
            $table->index('ppmp_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
