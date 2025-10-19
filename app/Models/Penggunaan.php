<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penggunaan extends Model
{
    /** @use HasFactory<\Database\Factories\PenggunaanFactory> */
    use HasFactory;

    protected $fillable = [
        'kode_penggunaan',
        'kendaraan_id',
        'sopir_id',
        'tanggal_mulai',
        'waktu_mulai',
        'tanggal_selesai',
        'waktu_selesai',
        'tujuan',
        'catatan',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $huruf = strtoupper(Str::random(3));
            $angka = rand(10, 99);
            $model->kode_penggunaan = "PG-$huruf$angka";
        });
    }

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function sopir()
    {
        return $this->belongsTo(Driver::class, 'sopir_id');
    }
}
