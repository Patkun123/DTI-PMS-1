<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SourceOfFundRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::check();
    }

    public function rules()
    {
        return [
            'division' => ['nullable','string','max:255'],
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string'],
        ];
    }
}
