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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('kode_sopir');
            $table->string('nama');
            $table->string('nip')->unique();
            $table->string('no_hp');
            $table->enum('status', ['Active', 'Off', 'Inactive']);
            $table->string('sim');
            $table->date('masa_berlaku_sim');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
