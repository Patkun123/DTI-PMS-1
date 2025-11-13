<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppmp_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppmp_detail_id')->constrained('ppmp_details')->onDelete('cascade');
            $table->string('detail');
            $table->string('type_project');
            $table->string('qty_size');
            $table->string('recommended');
            $table->string('ppc');
            $table->date('start_activity');
            $table->date('end_activity');
            $table->string('expected_delivery');
            $table->string('source_funds')->nullable();
            $table->decimal('estimated_budget', 15, 2)->default(0);
            $table->string('attached_support')->nullable();
            $table->text('remarks')->nullable();
            $table->string('ppmp_ref')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index('ppmp_detail_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppmp_items');
    }
};
