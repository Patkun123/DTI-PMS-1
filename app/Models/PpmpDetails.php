<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpmpDetails extends Model
{
    use HasFactory;
     protected $fillable = [
        'general_description',
        'ppmp_id'
    ];



    public function ppmp()
    {
        return $this->belongsTo(Ppmp::class);
    }
    public function items(): HasMany
    {
        return $this->hasMany(PpmpItems::class, 'ppmp_detail_id');
    }
}
