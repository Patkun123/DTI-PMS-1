<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PpmpItems extends Model
{
    use HasFactory;
    protected $table = 'ppmp_items';
    protected $fillable = [
        'detail',
        'ppmp_detail_id',
        'type_project',
        'qty_size',
        'recommended',
        'ppc',
        'start_activity',
        'end_activity',
        'expected_delivery',
        'source_funds',
        'estimated_budget',
        'attached_support',
        'remarks',
        'ppmp_ref',
    ];
    protected $casts = [
        'start_activity' => 'date:Y-m-d',
        'end_activity' => 'date:Y-m-d',
        'estimated_budget' => 'decimal:2',
    ];
    public function ppmpdetails(): BelongsTo
    {
        return $this->belongsTo(PpmpDetails::class, 'ppmp_detail_id');
    }
}
