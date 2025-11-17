<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $ppmp_no
 * @property string $ppmp_ref
 * @property int $user_id
 * @property string|null $status_plan
 * @property string|null $division
 * @property string|null $status
 * @property \Illuminate\Support\Carbon|null $approved_date
 * @property float $total
 * @property float $allocated_budget
 * @property float $used_budget
 * @property float $remaining_budget
 * @property string|null $budget_status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property User $user
 * @property \Illuminate\Database\Eloquent\Collection $details
 * @property \Illuminate\Database\Eloquent\Collection $purchaseRequests
 */
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
        // Convert full fund name to code (e.g., "Work Environment" -> "WORK-ENVIRONMENT")
        // Remove hyphens and multiple spaces, then replace remaining spaces with hyphens
        $fundCode = strtoupper(trim(preg_replace('/[\s-]+/', '-', $sourceFunds)));

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

        // Generate reference like: WORK-ENVIRONMENT-2025-001
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
