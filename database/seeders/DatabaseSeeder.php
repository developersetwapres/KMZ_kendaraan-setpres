<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Kendaraan;
use App\Models\Penggunaan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'administrator@set.presidenri.go.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('K3ndar4aN!'),
                'email_verified_at' => now(),
            ]
        );


        Kendaraan::factory(10)->create();
        Driver::factory(10)->create();
        Penggunaan::factory(500)->create();
    }
}
