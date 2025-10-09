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
        'purpose',
        'ris_status',
        'ris_number',
        'status',
        'requested_date',
    ];

    protected $casts = [
        'requested_date' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    // ✅ Each PR belongs to one user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ✅ Each PR has many items (nested line items)
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers / Accessors
    |--------------------------------------------------------------------------
    */

    // ✅ Generate unique PR number (Year + Month + Sequence)
    public function generatePrNumber(int $userId): string
    {
        // Get the user's division from the users table
        $user = \App\Models\User::find($userId);
        $division = strtoupper($user->division ?? 'GEN'); // fallback to 'GEN' if missing

        // Get current year and month
        $year = now()->format('y'); // two-digit year (e.g. 25)
        $month = now()->format('m'); // two-digit month (e.g. 10)

        // Find the last PR for this division in the same month
        $lastPr = static::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->where('pr_number', 'like', "PR-$division-%")
            ->orderBy('id', 'desc')
            ->first();

        // Determine sequence
        $sequence = $lastPr ? (int) substr($lastPr->pr_number, -4) + 1 : 1;

        // Generate PR number like: PR-AFMD-25-10-0001
        return sprintf('PR-%s-%s-%s-%04d', $division, $year, $month, $sequence);
    }

    public static function generateRisNumber(int $userId, bool $withRis = false): ?string
    {
        // No RIS generation needed
        if (!$withRis) {
            return null;
        }

        $user = \App\Models\User::find($userId);
        $division = strtoupper($user->division ?? 'GEN');

        $year = now()->format('y');
        $month = now()->format('m');

        $lastRis = static::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->whereNotNull('ris_number')
            ->where('ris_number', 'like', "RIS-$division-%")
            ->orderByDesc('id')
            ->first();

        $sequence = $lastRis ? (int) substr($lastRis->ris_number, -4) + 1 : 1;

        // Example: RIS-ACCOUNTING-25-10-0001
        return sprintf('RIS-%s-%s-%s-%04d', $division, $year, $month, $sequence);
    }




    // ✅ For showing color-coded badges in UI
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            default => 'gray',
        };
    }

    // ✅ Optional helper: compute total cost from all items
    public function getGrandTotalAttribute(): float
    {
        return $this->items->sum('total_cost');
    }
    public static function boot()
    {
        parent::boot();

        static::deleting(function ($purchaseRequest) {
            $purchaseRequest->items()->delete();
        });
    }

}
