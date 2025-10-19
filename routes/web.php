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
    Route::post('dashboard/penggunaan/store', [PenggunaanController::class, 'store'])->name('penggunaan.store');
    Route::patch('dashboard/penggunaan/status/{penggunaan:kode_penggunaan}', [PenggunaanController::class, 'status'])->name('penggunaan.status');
    Route::delete('dashboard/penggunaan/destroy/{penggunaan:kode_penggunaan}', [PenggunaanController::class, 'destroy'])->name('penggunaan.destroy');

    Route::get('dashboard/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    Route::post('dashboard/kendaraan/store', [KendaraanController::class, 'store'])->name('kendaraan.store');
    Route::put('dashboard/kendaraan/update/{kendaraan:kode_kendaraan}', [KendaraanController::class, 'update'])->name('kendaraan.update');
    Route::delete('dashboard/kendaraan/destroy/{kendaraan:kode_kendaraan}', [KendaraanController::class, 'destroy'])->name('kendaraan.destroy');

    Route::get('dashboard/driver', [DriverController::class, 'index'])->name('driver.index');
    Route::post('dashboard/driver/store', [DriverController::class, 'store'])->name('driver.store');
    Route::put('dashboard/driver/update/{driver:kode_sopir}', [DriverController::class, 'update'])->name('driver.update');
    Route::delete('dashboard/driver/destroy/{driver:kode_sopir}', [DriverController::class, 'destroy'])->name('driver.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
