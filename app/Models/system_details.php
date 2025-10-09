<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class system_details extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'regional_director',
    ];
}
