<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kendaraan>
 */
class KendaraanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nomor_polisi' => strtoupper(fake()->bothify('B #### ??')),
            'merk' => fake()->randomElement(['Toyota', 'Honda', 'Suzuki', 'Mitsubishi']),
            'tipe' => fake()->word(),
            'tahun_pembuatan' => fake()->year(),
            'warna' => fake()->safeColorName(),
            'nomor_rangka' => strtoupper(fake()->bothify('RNG######??')),
            'nomor_mesin' => strtoupper(fake()->bothify('MSN######??')),
            'status' => fake()->randomElement(['Active', 'Maintenance', 'Inactive']),
            'foto_kendaraan' => null,
        ];
    }
}
