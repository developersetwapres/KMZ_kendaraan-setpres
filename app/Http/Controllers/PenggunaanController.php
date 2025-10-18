<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenggunaanRequest;
use App\Http\Requests\UpdatePenggunaanRequest;
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
        return Inertia::render('penggunaan/page');
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
        //
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
        //
    }
}
