<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Kendaraan extends Model
{
    /** @use HasFactory<\Database\Factories\KendaraanFactory> */
    use HasFactory;

    protected $fillable = [
        'kode_kendaraan',
        'nomor_polisi',
        'merk',
        'tipe',
        'tahun_pembuatan',
        'warna',
        'nomor_rangka',
        'nomor_mesin',
        'status',
        'foto_kendaraan',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $huruf = strtoupper(Str::random(3));
            $angka = rand(10, 99);
            $model->kode_kendaraan = "PG-$huruf$angka";
        });
    }
}
