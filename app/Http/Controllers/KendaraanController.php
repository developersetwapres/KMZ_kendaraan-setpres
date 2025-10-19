<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKendaraanRequest;
use App\Http\Requests\UpdateKendaraanRequest;
use App\Models\Kendaraan;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class KendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $tahunBerjalan = Carbon::now()->year;

        $data = [
            'initialData' => Kendaraan::whereYear('created_at', $tahunBerjalan)
                ->latest()
                ->take(100)
                ->get(),
        ];
        return Inertia::render('kendaraan/page', $data);
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
    public function store(StoreKendaraanRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto_kendaraan')) {
            $path = $request->file('foto_kendaraan')->store('kendaraan', 'public');
            $data['foto_kendaraan'] = $path;
        }

        Kendaraan::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Kendaraan $kendaraan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kendaraan $kendaraan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKendaraanRequest $request, Kendaraan $kendaraan)
    {
        $validated = $request->validated();
        $kendaraan->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kendaraan $kendaraan)
    {
        $kendaraan->delete();
    }
}
