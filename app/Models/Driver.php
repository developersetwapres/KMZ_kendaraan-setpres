<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Driver extends Model
{
    /** @use HasFactory<\Database\Factories\DriverFactory> */
    use HasFactory;

    protected $fillable = [
        'kode_sopir',
        'nama',
        'nip',
        'no_hp',
        'status',
        'sim',
        'masa_berlaku_sim',
        'foto',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $huruf = strtoupper(Str::random(3));
            $angka = rand(10, 99);
            $model->kode_sopir = "DV-$huruf$angka";
        });
    }
}
