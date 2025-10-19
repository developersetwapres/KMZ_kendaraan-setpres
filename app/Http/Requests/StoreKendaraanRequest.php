<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nomor_polisi' => 'required|string|max:20',
            'merk' => 'required|string|max:100',
            'tipe' => 'required|string|max:100',
            'tahun_pembuatan' => 'required|string|max:4',
            'warna' => 'required|string|max:50',
            'nomor_rangka' => 'required|string|max:100',
            'nomor_mesin' => 'required|string|max:100',
            'status' => 'required|string|max:50',
            'foto_kendaraan' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_polisi.required'    => 'Nomor polisi wajib diisi.',
            'merk.required'            => 'Merk kendaraan wajib diisi.',
            'tipe.required'            => 'Tipe kendaraan wajib diisi.',
            'tahun_pembuatan.required' => 'Tahun pembuatan wajib diisi.',
            'warna.required'           => 'Warna kendaraan wajib diisi.',
            'nomor_rangka.required'    => 'Nomor rangka wajib diisi.',
            'nomor_mesin.required'     => 'Nomor mesin wajib diisi.',
            'status.required'          => 'Status kendaraan wajib diisi.',
            'foto_kendaraan.image'     => 'File foto kendaraan harus berupa gambar.',
            'foto_kendaraan.mimes'     => 'Format foto kendaraan harus jpg, jpeg, atau png.',
            'foto_kendaraan.max'       => 'Ukuran foto kendaraan maksimal 2MB.',
        ];
    }
}
