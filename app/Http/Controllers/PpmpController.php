<?php

namespace App\Http\Controllers;

use App\Models\Ppmp;
use App\Models\PpmpDetails;
use App\Models\PpmpItems;
use App\Models\SourceOfFund;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PpmpController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ppmp = Ppmp::withCount('details')
            ->with(['user'])
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(function ($plan) {
                return [
                    'id' => $plan->id,
                    'ppmp_no' => $plan->ppmp_no,
                    'ppmp_ref' => $plan->ppmp_ref,
                    'status_plan' => $plan->status_plan,
                    'division' => $plan->division,
                    'status' => $plan->status,
                    'approved_date' => $plan->approved_date,
                    'total' => $plan->total,
                    'allocated_budget' => $plan->allocated_budget,
                    'used_budget' => $plan->used_budget,
                    'remaining_budget' => $plan->remaining_budget,
                    'budget_status' => $plan->budget_status,
                    'details_count' => $plan->details_count,
                    'created_at' => $plan->created_at,
                    'user' => [
                        'id' => $plan->user?->id,
                        'name' => $plan->user?->name,
                        'email' => $plan->user?->email,
                    ],
                ];
            });

        return Inertia::render('ppmp/index', [
            'ppmp' => $ppmp,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $division = Auth::user()->division ?? 'General';
        $proposed = $this->generateNextPpmpNo($division);

        return Inertia::render('ppmp/create', [
            'proposed_ppmp_no' => $proposed,
            'user_division' => $division,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'status_plan' => 'nullable|string',
            'status' => 'nullable|in:close,utilized,process',
            'approved_date' => 'nullable',
            // Top-level source_funds removed: source of funds is now stored on procurement project details
            'allocated_budget' => 'required|numeric|min:0', // Add allocated budget validation
            'details' => 'required|array|min:1',
            'details.*.general_description' => 'required|string',
            'details.*.items' => 'required|array|min:1',
            'details.*.items.*.detail' => 'required|string',
            'details.*.items.*.type_project' => 'required|string',
            'details.*.items.*.qty_size' => 'required|string',
            'details.*.items.*.recommended' => 'required|string',
            'details.*.items.*.ppc' => 'required|string',
            'details.*.items.*.start_activity' => 'required|date',
            'details.*.items.*.end_activity' => 'required|date',
            'details.*.items.*.expected_delivery' => 'required|string',
            'details.*.items.*.source_funds' => 'required|integer|exists:source_of_funds,id',
            'details.*.items.*.estimated_budget' => 'required|numeric',
            'details.*.items.*.attached_support' => 'required|string',
            'details.*.items.*.remarks' => 'required|string',
        ]);
        $total_budget = 0;
        foreach ($validated['details'] as $detail) {
            foreach ($detail['items'] as $item) {
                $total_budget += (float) $item['estimated_budget'];
            }
        }
        $division = Auth::user()->division ?? 'General';
        $ppmpNo = $this->generateNextPpmpNo($division);

        // Generate automatic PPMP reference based on the first detail/item's source of funds ID
        // Convert ID to source of fund name for reference generation
        $firstSourceFundsId = null;
        if (!empty($validated['details']) && !empty($validated['details'][0]['items']) && isset($validated['details'][0]['items'][0]['source_funds'])) {
            $firstSourceFundsId = $validated['details'][0]['items'][0]['source_funds'];
        }

        // Look up the source fund name from ID for reference generation
        $firstSourceFundName = 'DEFAULT';
        if ($firstSourceFundsId) {
            $sourceOfFund = SourceOfFund::find($firstSourceFundsId);
            if ($sourceOfFund) {
                $firstSourceFundName = $sourceOfFund->name;
            }
        }
        $ppmpRef = Ppmp::generatePpmpReference($firstSourceFundName);

        $ppmpId = DB::transaction(function () use ($validated, $division, $ppmpNo, $ppmpRef, $total_budget) {
            $ppmp = Ppmp::create([
                'ppmp_no' => $ppmpNo,
                'ppmp_ref' => $ppmpRef,
                'user_id' => Auth::user()->id,
                'status_plan' => $validated['status_plan'] ?? 'indicative',
                'division' => $division,
                'status' => 'process',
                'approved_date' => null,
                'total' => $total_budget,
                'allocated_budget' => $validated['allocated_budget'],
                'used_budget' => 0,
                'remaining_budget' => $validated['allocated_budget'],
                'budget_status' => 'available', // Default budget status
            ]);

            foreach ($validated['details'] as $detailIndex => $detailData) {
                // Create detail and store its source_funds (derive from first item ID and convert to name)
                $detailSource = null;
                if (!empty($detailData['items']) && isset($detailData['items'][0]['source_funds'])) {
                    $sourceId = $detailData['items'][0]['source_funds'];
                    $sourceOfFund = SourceOfFund::find($sourceId);
                    $detailSource = $sourceOfFund ? $sourceOfFund->name : null;
                }

                $detail = PpmpDetails::create([
                    'ppmp_id' => $ppmp->id,
                    'general_description' => $detailData['general_description'],
                    'ppmp_code' => $ppmpRef . '-' . str_pad($detailIndex + 1, 2, '0', STR_PAD_LEFT),
                    'source_funds' => $detailSource,
                ]);

                foreach ($detailData['items'] as $itemIndex => $itemData) {
                    // Convert source_funds ID to name
                    $sourceFundName = null;
                    if (isset($itemData['source_funds'])) {
                        $sourceOfFund = SourceOfFund::find($itemData['source_funds']);
                        $sourceFundName = $sourceOfFund ? $sourceOfFund->name : null;
                    }

                    PpmpItems::create([
                        'detail' => $itemData['detail'],
                        'ppmp_detail_id' => $detail->id,
                        'type_project' => $itemData['type_project'],
                        'qty_size' => $itemData['qty_size'],
                        'recommended' => $itemData['recommended'],
                        'ppc' => $itemData['ppc'],
                        'start_activity' => $itemData['start_activity'],
                        'end_activity' => $itemData['end_activity'],
                        'expected_delivery' => $itemData['expected_delivery'],
                        'source_funds' => $sourceFundName,
                        'estimated_budget' => (float) $itemData['estimated_budget'],
                        'attached_support' => $itemData['attached_support'],
                        'remarks' => $itemData['remarks'],
                        'ppmp_ref' => $ppmpRef . '-' . str_pad($detailIndex + 1, 2, '0', STR_PAD_LEFT) . '-' . str_pad($itemIndex + 1, 2, '0', STR_PAD_LEFT)
                    ]);
                }
            }

            return $ppmp->id;
        });

        return redirect()
            ->route('ppmp.show', $ppmpId)
            ->with('success', 'PPMP plan created successfully.');
    }

    private function generateNextPpmpNo(string $division): string
    {
        $year = date('Y');

        // Find last sequence for this year
        $last = Ppmp::whereYear('created_at', $year)
            ->orderByDesc('id')
            ->first();

        $next = 1;

        if ($last) {
            // Extract the trailing 3 digits if format matches YYYY-### or similar
            if (preg_match('/(\d{3})$/', $last->ppmp_no, $m)) {
                $next = intval($m[1]) + 1;
            }
        }

        return $year . '-' . str_pad((string) $next, 3, '0', STR_PAD_LEFT);
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ppmp = Ppmp::with(['user', 'details.items'])
            ->findOrFail($id);

        // Authorize: only final plans with utilized status can be viewed
        $this->authorize('view', $ppmp);

        return Inertia::render('ppmp/show', [
            'ppmp' => $ppmp,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ppmp = Ppmp::with(['details.items'])
            ->findOrFail($id);

        // Authorize: only final plans with utilized status can be edited
        $this->authorize('update', $ppmp);

        return Inertia::render('ppmp/edit', [
            'ppmp' => $ppmp,
        ]);
    }

    /**
     * Render printable PPMP page. Accepts optional ?ppmp=ID to load data.
     */
    public function print(Ppmp $ppmp): Response
    {
        // Authorize: only final plans with utilized status can be printed
        $this->authorize('print', $ppmp);

        $ppmp->load(['user', 'details.items']);

        return Inertia::render('ppmp/print', [
            'ppmp' => $ppmp,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ppmp = Ppmp::with(['details.items'])->findOrFail($id);

        // Authorize: only final plans with utilized status can be updated
        $this->authorize('update', $ppmp);

        $validated = $request->validate([
            'status_plan' => 'nullable|string',
            'status' => 'nullable|in:close,utilized,process',
            'approved_date' => 'nullable',
            'details' => 'nullable|array',
            'details.*.id' => 'nullable|integer|exists:ppmp_details,id',
            'details.*.general_description' => 'required_with:details|string',
            'details.*.items' => 'required_with:details|array|min:1',
            'details.*.items.*.id' => 'nullable|integer|exists:ppmp_items,id',
            'details.*.items.*.type_project' => 'required|string',
            'details.*.items.*.qty_size' => 'required|string',
            'details.*.items.*.recommended' => 'required|string',
            'details.*.items.*.ppc' => 'required|string',
            'details.*.items.*.start_activity' => 'required|date',
            'details.*.items.*.end_activity' => 'required|date',
            'details.*.items.*.expected_delivery' => 'required|string',
            'details.*.items.*.source_funds' => 'required|integer|exists:source_of_funds,id',
            'details.*.items.*.estimated_budget' => 'required|numeric',
            'details.*.items.*.attached_support' => 'required|string',
            'details.*.items.*.remarks' => 'required|string',
        ]);

        // Update top-level fields
        $ppmp->status_plan = $validated['status_plan'] ?? $ppmp->status_plan;
        $ppmp->status = $validated['status'] ?? $ppmp->status;
        $ppmp->approved_date = $validated['approved_date'] ?? $ppmp->approved_date;

        // If details provided, replace the tree for simplicity
        $newTotal = 0;
        if (isset($validated['details'])) {
            // Delete existing details/items and recreate from payload
            $ppmp->details()->delete();

            foreach ($validated['details'] as $detailData) {
                // derive detail-level source_funds from its first item ID and convert to name
                $detailSource = null;
                if (!empty($detailData['items']) && isset($detailData['items'][0]['source_funds'])) {
                    $sourceId = $detailData['items'][0]['source_funds'];
                    $sourceOfFund = SourceOfFund::find($sourceId);
                    $detailSource = $sourceOfFund ? $sourceOfFund->name : null;
                }

                $detail = PpmpDetails::create([
                    'ppmp_id' => $ppmp->id,
                    'general_description' => $detailData['general_description'],
                    'source_funds' => $detailSource,
                ]);

                foreach ($detailData['items'] as $itemData) {
                    // Convert source_funds ID to name
                    $sourceFundName = null;
                    if (isset($itemData['source_funds'])) {
                        $sourceOfFund = SourceOfFund::find($itemData['source_funds']);
                        $sourceFundName = $sourceOfFund ? $sourceOfFund->name : null;
                    }

                    PpmpItems::create([
                        'ppmp_detail_id' => $detail->id,
                        'type_project' => $itemData['type_project'],
                        'qty_size' => $itemData['qty_size'],
                        'recommended' => $itemData['recommended'],
                        'ppc' => $itemData['ppc'],
                        'start_activity' => $itemData['start_activity'],
                        'end_activity' => $itemData['end_activity'],
                        'expected_delivery' => $itemData['expected_delivery'],
                        'source_funds' => $sourceFundName,
                        'estimated_budget' => $itemData['estimated_budget'],
                        'attached_support' => $itemData['attached_support'],
                        'remarks' => $itemData['remarks'],
                    ]);
                    $newTotal += (float) $itemData['estimated_budget'];
                }
            }
        } else {
            // Recompute total from existing items if details not provided
            foreach ($ppmp->details as $detail) {
                foreach ($detail->items as $item) {
                    $newTotal += (float) $item->estimated_budget;
                }
            }
        }

        $ppmp->total = $newTotal;
        $ppmp->save();

        return redirect()->route('ppmp.show', $ppmp->id)->with('success', 'PPMP updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ppmp = Ppmp::findOrFail($id);
        $ppmp->delete();

        return redirect()->route('ppmp.index')->with('success', 'PPMP deleted.');
    }
}
