<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenggunaanRequest;
use App\Http\Requests\UpdatePenggunaanRequest;
use App\Models\Driver;
use Illuminate\Support\Carbon;
use App\Models\Kendaraan;
use App\Models\Penggunaan;
use Inertia\Inertia;
use Inertia\Response;

class PenggunaanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $tahunBerjalan = Carbon::now()->year;

        $data = [
            'kendaraanList' => Kendaraan::select(['id', 'tipe', 'nomor_polisi', 'merk'])
                ->where('status', 'Active')
                ->get(),

            'sopirList' => Driver::select(['id', 'nama'])
                ->where('status', 'Active')->get(),

            'initialData' =>  Penggunaan::with(['kendaraan', 'sopir'])
                ->whereYear('tanggal_mulai', $tahunBerjalan)
                ->latest()
                ->take(500)
                ->get(),
        ];

        return Inertia::render('penggunaan/page', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePenggunaanRequest $request)
    {
        $data = $request->validated();
        $data['status'] = 'Dalam Perjalanan'; // Status selalu default

        Penggunaan::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Penggunaan $penggunaan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Penggunaan $penggunaan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePenggunaanRequest $request, Penggunaan $penggunaan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penggunaan $penggunaan)
    {
        $penggunaan->delete();
    }

    public function status(Penggunaan $penggunaan)
    {
        $penggunaan->update([
            'tanggal_selesai' => Carbon::now()->toDateString(),
            'waktu_selesai' => Carbon::now()->format('H:i'),
            'status' => 'Selesai',
        ]);
    }
}
