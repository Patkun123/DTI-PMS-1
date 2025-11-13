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
        'ppmp_ref',
        'user_id',
        'status_plan',
        'division',
        'status',
        'approved_date',
        'total',
        'allocated_budget',
        'used_budget',
        'remaining_budget',
        'budget_status',
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

    // ✅ Each PPMP has many purchase requests
    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }
    /*
    |--------------------------------------------------------------------------
    | Helper Methods
    |--------------------------------------------------------------------------
    */

    // ✅ Generate automatic PPMP reference code based on source of funds
    public static function generatePpmpReference(string $sourceFunds): string
    {
        // Extract the main fund code (e.g., "OTOP" from "OTOP - One Town One Product")
        $fundCode = strtoupper(trim(explode(' ', $sourceFunds)[0]));

        // Get current year
        $year = now()->format('Y');

        // Find the last PPMP reference for this fund code and year
        $lastPpmp = static::where('ppmp_ref', 'like', "{$fundCode}-{$year}-%")
            ->orderByDesc('id')
            ->first();

        // Determine next sequence number
        $sequence = 1;
        if ($lastPpmp && preg_match('/' . preg_quote($fundCode) . '-' . $year . '-(\d+)$/', $lastPpmp->ppmp_ref, $matches)) {
            $sequence = (int)$matches[1] + 1;
        }

        // Generate reference like: OTOP-2025-001
        return sprintf('%s-%s-%03d', $fundCode, $year, $sequence);
    }

    // ✅ Calculate total used budget from all purchase requests
    public function calculateUsedBudget(): float
    {
        return $this->purchaseRequests()
            ->with('items')
            ->get()
            ->sum(function ($pr) {
                return $pr->items->sum('total_cost');
            });
    }

    // ✅ Calculate remaining budget
    public function calculateRemainingBudget(): float
    {
        return $this->allocated_budget - $this->used_budget;
    }

    // ✅ Update budget and status automatically
    public function updateBudgetAndStatus(): void
    {
        $this->used_budget = $this->calculateUsedBudget();
        $this->remaining_budget = $this->calculateRemainingBudget();

        // Update status based on budget
        if ($this->remaining_budget <= 0) {
            $this->status = 'close';
            $this->budget_status = 'Exhausted';
        } elseif ($this->used_budget > 0) {
            $this->status = 'utilized';
            $this->budget_status = 'Partially Used';
        } else {
            $this->status = 'process';
            $this->budget_status = 'Available';
        }

        $this->save();
    }

    // ✅ Check if PPMP has sufficient budget for a purchase request
    public function hasSufficientBudget(float $amount): bool
    {
        return $this->remaining_budget >= $amount;
    }

    // ✅ Get budget status for display
    public function getBudgetStatusAttribute(): string
    {
        if ($this->remaining_budget <= 0) {
            return 'Exhausted';
        } elseif ($this->used_budget > 0) {
            return 'Partially Used';
        } else {
            return 'Available';
        }
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($ppmp) {
            $ppmp->details()->delete();
        });
    }
}
