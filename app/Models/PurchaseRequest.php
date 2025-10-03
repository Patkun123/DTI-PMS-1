<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'pr_number',
        'user_id',
        'stock_no',
        'item_description',
        'quantity',
        'unit_cost',
        'total_cost',
        'purpose',
        'status',
        'unit',
        'requested_date',
    ];

    protected $casts = [
        'requested_date' => 'date',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generatePrNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');
        $lastPr = static::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastPr ? (int) substr($lastPr->pr_number, -4) + 1 : 1;

        return sprintf('PR-%s%s-%04d', $year, $month, $sequence);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            default => 'yellow',
        };
    }
}
