<?php

namespace Database\Factories;

use App\Models\Driver;
use App\Models\Kendaraan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penggunaan>
 */
class PenggunaanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kendaraan_id' => Kendaraan::factory(),
            'sopir_id' => Driver::factory(),
            'tanggal_mulai' => fake()->date(),
            'waktu_mulai' => fake()->time('H:i'),
            'tanggal_selesai' => null,
            'waktu_selesai' => null,
            'tujuan' => fake()->city(),
            'catatan' => fake()->sentence(),
            'status' => 'Dalam Perjalanan',
        ];
    }
}
