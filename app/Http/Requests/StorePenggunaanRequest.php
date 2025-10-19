<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenggunaanRequest extends FormRequest
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
            'kendaraan_id' => 'required|exists:kendaraans,id',
            'sopir_id' => 'required|exists:drivers,id',
            'tanggal_mulai' => 'required|date',
            'waktu_mulai' => 'required|date_format:H:i',
            'tanggal_selesai' => 'nullable|date',
            'waktu_selesai' => 'nullable|date_format:H:i',
            'tujuan' => 'required|string|max:255',
            'catatan' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'kendaraan_id.required' => 'Kendaraan wajib dipilih.',
            'kendaraan_id.exists' => 'Kendaraan tidak ditemukan.',
            'sopir_id.required' => 'Sopir wajib dipilih.',
            'sopir_id.exists' => 'Sopir tidak ditemukan.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'waktu_mulai.required' => 'Waktu mulai wajib diisi.',
            'waktu_mulai.date_format' => 'Format waktu mulai harus HH:mm.',
            'tujuan.required' => 'Tujuan perjalanan wajib diisi.',
        ];
    }
}
