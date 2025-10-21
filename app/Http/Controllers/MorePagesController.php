<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Inertia\Inertia;
use App\Models\Kendaraan;
use App\Models\Penggunaan;
use Carbon\Carbon;
use Inertia\Response;
use Illuminate\Http\Request;

class MorePagesController extends Controller
{
    public function dashboard(): Response
    {
        $tahunBerjalan = Carbon::now()->year;

        $data = [
            'kendaraanData' => Kendaraan::select(['kode_kendaraan', 'status'])
                ->get(),

            'sopirData' => Driver::select(['kode_sopir', 'status'])
                ->get(),

            'penggunaanData' =>  Penggunaan::select(['kode_penggunaan', 'status', 'tanggal_mulai', 'tanggal_selesai', 'waktu_mulai', 'waktu_selesai', 'sopir_id', 'kendaraan_id'])
                ->with(['kendaraan', 'sopir'])
                ->whereYear('tanggal_mulai', $tahunBerjalan)
                ->latest()
                ->get(),
        ];

        return Inertia::render('dashboard', $data);
    }
}
