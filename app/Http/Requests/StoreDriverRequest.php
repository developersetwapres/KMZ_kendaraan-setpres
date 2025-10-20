<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
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
            'nama' => 'required|string|max:100',
            'nip' => 'required|string|max:50|unique:drivers,nip',
            'no_hp' => 'required|string|max:20',
            'status' => 'required|in:Active,Off,Inactive',
            'sim' => 'required|string|max:50',
            'masa_berlaku_sim' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama driver wajib diisi.',
            'nip.required' => 'NIP wajib diisi.',
            'nip.unique' => 'NIP sudah terdaftar.',
            'no_hp.required' => 'Nomor HP wajib diisi.',
            'status.required' => 'Status wajib diisi.',
            'sim.required' => 'Nomor SIM wajib diisi.',
            'masa_berlaku_sim.required' => 'Masa berlaku SIM wajib diisi.',
            'masa_berlaku_sim.date' => 'Format masa berlaku SIM tidak valid.',
            'foto.image' => 'File foto harus berupa gambar.',
            'foto.mimes' => 'Format foto harus jpg, jpeg, atau png.',
            'foto.max' => 'Ukuran foto maksimal 2MB.',
        ];
    }
}
