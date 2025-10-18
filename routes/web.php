<?php

use App\Http\Controllers\DriverController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\PenggunaanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dashboard/penggunaan', [PenggunaanController::class, 'index'])->name('penggunaan.index');

    Route::get('dashboard/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    Route::post('dashboard/kendaraan/store', [KendaraanController::class, 'store'])->name('kendaraan.store');

    Route::get('dashboard/driver', [DriverController::class, 'index'])->name('driver.index');
    Route::post('dashboard/driver/store', [DriverController::class, 'store'])->name('driver.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
