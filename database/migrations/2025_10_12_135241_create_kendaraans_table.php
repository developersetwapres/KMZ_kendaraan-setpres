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
        Schema::create('kendaraans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kendaraan');
            $table->string('nomor_polisi');
            $table->string('merk');
            $table->string('tipe');
            $table->string('tahun_pembuatan');
            $table->string('warna');
            $table->string('nomor_rangka');
            $table->string('nomor_mesin');
            $table->enum('status', ['Active', 'Maintenance', 'Inactive']);
            $table->string('foto_kendaraan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraans');
    }
};
