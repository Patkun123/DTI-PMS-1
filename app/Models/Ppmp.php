<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ppmp extends Model
{
    use HasFactory;
    protected $table = 'ppmp';
    protected $fillable = [
        'ppmp_no',
        'user_id',
        'status_plan',
        'division',
        'status',
        'approved_date',
        'total',
    ];

    protected $casts = [
        'approved_date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function details(): HasMany
    {
        return $this->hasMany(PpmpDetails::class);
    }
    public static function boot()
    {
        parent::boot();

        static::deleting(function ($ppmp) {
            $ppmp->details()->delete();
        });
    }
}
