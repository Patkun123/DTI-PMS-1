<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PurchaseRequestController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Build base query with relationships
        $query = PurchaseRequest::with(['user', 'items', 'ppmp']);

        // 🔹 Only show current user's requests if they're a regular user
        if ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        // 🔹 Optional filter by division (from query string ?division=AFMD)
        if (request()->has('division') && request('division') !== '') {
            $query->whereHas('user', function ($q) {
                $q->where('division', request('division'));
            });
        }

        // 🔹 Optional filter by year (from query string ?year=2024) - SQLite compatible
        if (request()->has('year') && request('year') !== '') {
            $query->whereRaw('strftime("%Y", requested_date) = ?', [request('year')]);
        }

        // 🔹 Optional filter by month (from query string ?month=01) - SQLite compatible
        if (request()->has('month') && request('month') !== '') {
            $query->whereRaw('strftime("%m", requested_date) = ?', [request('month')]);
        }

        // 🔹 Fetch data
        $purchaseRequests = $query->latest()->get();

        // 🔹 Flatten items for the table
        $flattened = $purchaseRequests->flatMap(function ($pr) {
            return $pr->items->map(function ($item) use ($pr) {
                return [
                    'id' => $pr->id,
                    'pr_number' => $pr->pr_number,
                    'stock_no' => $item->stock_no,
                    'item_description' => $item->item_description,
                    'quantity' => $item->quantity,
                    'unit_cost' => $item->unit_cost,
                    'total_cost' => $item->quantity * $item->unit_cost,
                    'status' => $pr->status,
                    'requested_date' => $pr->requested_date,
                    'user' => [
                        'name' => $pr->user->name,
                        'division' => $pr->user->division,
                    ],
                    'ppmp' => $pr->ppmp ? [
                        'id' => $pr->ppmp->id,
                        'ppmp_ref' => $pr->ppmp->ppmp_ref,
                        'ppmp_no' => $pr->ppmp->ppmp_no,
                    ] : null,
                    'created_at' => $pr->created_at,
                ];
            });
        })->values();
        $page = request('page', 1);
        $perPage = 7;
        $paginator = new LengthAwarePaginator(
            $flattened->forPage($page, $perPage),
            $flattened->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        // 🔹 Return to Inertia with data and available divisions
        $divisions = \App\Models\User::select('division')
            ->distinct()
            ->pluck('division')
            ->filter()
            ->values();

        // 🔹 Get available years from purchase requests (SQLite compatible)
        $availableYears = \App\Models\PurchaseRequest::selectRaw('strftime("%Y", requested_date) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->values();

        // 🔹 Get available PPMPs for the current user's division
        // Only show PPMPs with status_plan='final' AND status='utilized'
        $availablePpmps = \App\Models\Ppmp::where('status_plan', 'final')
            ->where('status', 'utilized')
            ->where('division', $user->division)
            ->where('remaining_budget', '>', 0) // Only show PPMPs with remaining budget
            ->select('id', 'ppmp_ref', 'ppmp_no', 'total', 'allocated_budget', 'used_budget', 'remaining_budget')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('purchase-requests/index', [
            'purchaseRequests' => [
                'data' => $flattened, // 👈 send all
                'total' => $flattened->count(),
            ],
            'divisions' => $divisions,
            'availableYears' => $availableYears,
            'availablePpmps' => $availablePpmps,
            'filters' => [
                'division' => request('division'),
                'year' => request('year'),
                'month' => request('month'),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $user = Auth::user();

        // Get available PPMPs for the current user's division
        // Only show PPMPs with status_plan='final' AND status='utilized'
        $availablePpmps = \App\Models\Ppmp::where('status_plan', 'final')
            ->where('status', 'utilized')
            ->where('division', $user->division)
            ->where('remaining_budget', '>', 0) // Only show PPMPs with remaining budget
            ->select('id', 'ppmp_ref', 'ppmp_no', 'total', 'allocated_budget', 'used_budget', 'remaining_budget')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('purchase-requests/create', [
            'availablePpmps' => $availablePpmps,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ppmp_id' => 'required|exists:ppmp,id', // Require PPMP reference
            'requested_date' => 'required|date',
            'purpose' => 'required|string',
            'ris_status' => 'required|string|in:none,with',
            'status' => 'sometimes|in:ongoing,approved,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.stock_no' => 'required|integer|min:1',
            'items.*.item_description' => 'required|string|max:1000',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit' => 'required|string',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        $userId = Auth::id();

        // Get the PPMP and check budget availability
        $ppmp = \App\Models\Ppmp::findOrFail($validated['ppmp_id']);

        // Calculate total cost of the purchase request
        $totalCost = collect($validated['items'])->sum(function ($item) {
            return $item['quantity'] * $item['unit_cost'];
        });

        // Check if PPMP has sufficient budget
        if (!$ppmp->hasSufficientBudget($totalCost)) {
            return back()->withErrors([
                'ppmp_id' => 'Insufficient budget in PPMP. Remaining budget: ₱' . number_format($ppmp->remaining_budget, 2) . ', Required: ₱' . number_format($totalCost, 2)
            ]);
        }

        // Determine if RIS should be generated
        $withRis = $validated['ris_status'] === 'with';

        // Create purchase request
        $purchaseRequest = new PurchaseRequest([
            'ppmp_id' => $validated['ppmp_id'],
            'requested_date' => $validated['requested_date'],
            'purpose' => $validated['purpose'],
            'ris_status' => $validated['ris_status'],
            'status' => $validated['status'] ?? 'ongoing',
            'user_id' => $userId,
        ]);

        // Generate PR and RIS numbers
        $purchaseRequest->pr_number = $purchaseRequest->generatePrNumber($userId);
        $purchaseRequest->ris_number = $withRis
            ? $purchaseRequest->generateRisNumber($userId, true)
            : null;

        $purchaseRequest->save();

        // Save purchase request items
        $stockNo = 1;
        foreach ($validated['items'] as $item) {
            $purchaseRequest->items()->create([
                'stock_no' => $stockNo++,
                'item_description' => $item['item_description'],
                'quantity' => $item['quantity'],
                'unit' => $item['unit'],
                'unit_cost' => $item['unit_cost'],
                'total_cost' => $item['quantity'] * $item['unit_cost'],
            ]);
        }

        // Update PPMP budget and status after creating the purchase request
        $ppmp->updateBudgetAndStatus();

        return redirect()
            ->route('purchase-requests.show', $purchaseRequest->id)
            ->with('success', 'Purchase request created successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest): Response
    {
        $purchaseRequest->load(['user', 'items', 'ppmp']);;

        return Inertia::render('purchase-requests/show', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseRequest $purchaseRequest): Response
    {
        return Inertia::render('purchase-requests/edit', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }
    public function approve(Request $request, PurchaseRequest $purchaseRequest)
    {
        $validated = $request->validate([
            'approved_date' => 'required|date',
        ]);

        if (in_array($purchaseRequest->status, ['cancelled', 'complete'])) {
            return back()->with('error', 'This request cannot be approved.');
        }

        $purchaseRequest->update([
            'status' => 'approved',
            'approved_date' => $validated['approved_date'],
        ]);

        return back()->with('success', 'Purchase Request approved successfully.');
    }

    public function complete(PurchaseRequest $purchaseRequest)
    {
        $this->authorize('approve', $purchaseRequest); // optional policy check

        $purchaseRequest->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Purchase Request complete successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        $validated = $request->validate([
            'purpose' => 'required|string',
            'requested_date' => 'required|date',
            'status' => 'sometimes|in:pending,approved',
            'ris_status' => 'required|string|in:none,with',
            'stock_no' => 'required|integer|min:1',
            'item_description' => 'required|string|max:1000',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string',
            'unit_cost' => 'required|numeric|min:0',
        ]);

        $validated['total_cost'] = $validated['quantity'] * $validated['unit_cost'];

        // Detect if RIS status changed
        $oldRisStatus = $purchaseRequest->ris_status;
        $newRisStatus = $validated['ris_status'];

        // If RIS changed from 'none' → 'with', generate a new RIS number
        if ($oldRisStatus === 'none' && $newRisStatus === 'with') {
            $purchaseRequest->ris_number = $purchaseRequest->generateRisNumber($purchaseRequest->user_id, true);
        }
        // If RIS changed from 'with' → 'none', clear RIS number
        elseif ($oldRisStatus === 'with' && $newRisStatus === 'none') {
            $purchaseRequest->ris_number = null;
        }

        // Update the main fields
        $purchaseRequest->update([
            'purpose' => $validated['purpose'],
            'requested_date' => $validated['requested_date'],
            'status' => $validated['status'] ?? $purchaseRequest->status,
            'ris_status' => $newRisStatus,
            'unit' => $validated['unit'],
            'quantity' => $validated['quantity'],
            'unit_cost' => $validated['unit_cost'],
            'total_cost' => $validated['total_cost'],
            'item_description' => $validated['item_description'],
            'stock_no' => $validated['stock_no'],
        ]);

        return redirect()
            ->route('purchase-requests.index')
            ->with('success', 'Purchase request updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        // Delete all related items first
        $purchaseRequest->items()->delete();

        // Then delete the purchase request
        $purchaseRequest->delete();

        return back();
    }



    /**
     * Display the print view for the specified resource.
     */
    public function print(PurchaseRequest $purchaseRequest): Response
    {
        $purchaseRequest->load(['user', 'items']);;

        return Inertia::render('purchase-requests/print', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }
    public function printwithris(PurchaseRequest $purchaseRequest): Response
    {
        $purchaseRequest->load(['user', 'items']);;

        return Inertia::render('purchase-requests/printwithris', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }
}
