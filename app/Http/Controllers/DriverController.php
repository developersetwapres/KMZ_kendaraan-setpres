<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Models\Driver;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $tahunBerjalan = Carbon::now()->year;

        $data = [
            'initialData' => Driver::whereYear('created_at', $tahunBerjalan)
                ->latest()
                ->take(100)
                ->get(),
        ];

        return Inertia::render('sopir/page', $data);
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
    public function store(StoreDriverRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('image/driver', 'public');
            $data['foto'] = $path;
        }

        Driver::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Driver $driver)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Driver $driver)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDriverRequest $request, Driver $driver)
    {
        $validated = $request->validated();

        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($driver->foto && Storage::disk('public')->exists($driver->foto)) {
                Storage::disk('public')->delete($driver->foto);
            }


            // Simpan foto baru
            $path = $request->file('foto')->store('image/driver', 'public');
            $validated['foto'] = $path;
        } else {
            // Pakai foto lama
            $validated['foto'] = $driver->foto;
        }

        $driver->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Driver $driver)
    {
        if ($driver->foto && Storage::disk('public')->exists($driver->foto)) {
            Storage::disk('public')->delete($driver->foto);
        }

        $driver->delete();
    }
}
