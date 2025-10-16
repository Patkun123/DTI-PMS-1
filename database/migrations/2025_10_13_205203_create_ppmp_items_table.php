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
        Schema::create('ppmp_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppmp_detail_id')
                ->constrained('ppmp_details')
                ->onDelete('cascade');
            $table->string('details');
            $table->string('type_project');
            $table->string('qty_size');
            $table->string('recommended');
            $table->string('ppc');
            $table->date('start_activity');
            $table->date('end_activity');
            $table->string('expected_delivery');
            $table->string('source_funds');
            $table->decimal('estimated_budget', 15, 2);
            $table->string('attached_support');
            $table->string('remarks');
            $table->string('ppmp_ref');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp_items');
    }
};
