<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Driver>
 */
class DriverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'nip' => fake()->unique()->numerify('1987######'),
            'no_hp' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['Active', 'Off', 'Inactive']),
            'sim' => fake()->bothify('SIM??######'),
            'masa_berlaku_sim' => fake()->dateTimeBetween('now', '+5 years')->format('Y-m-d'),
            'foto' => null,
        ];
    }
}
