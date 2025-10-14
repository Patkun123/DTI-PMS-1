<?php

namespace App\Http\Controllers;

use App\Models\Ppmp;
use App\Models\PpmpDetails;
use App\Models\PpmpItems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PpmpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ppmp/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ppmp/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'status_plan' => 'nullable|string',
            'status' => 'nullable|in:close,utilized,process',
            'approved_date' => 'nullable|date',
            'details' => 'required|array|min:1',
            'details.*.general_description' => 'required|string',
            'details.*.items' => 'required|array|min:1',
            'details.*.items.*.type_project' => 'required|string',
            'details.*.items.*.qty_size' => 'required|string',
            'details.*.items.*.recommended' => 'required|string',
            'details.*.items.*.ppc' => 'required|string',
            'details.*.items.*.start_activity' => 'required|date',
            'details.*.items.*.end_activity' => 'required|date',
            'details.*.items.*.expected_delivery' => 'required|string',
            'details.*.items.*.source_funds' => 'required|string',
            'details.*.items.*.estimated_budget' => 'required|numeric',
            'details.*.items.*.total' => 'required|numeric',
            'details.*.items.*.attached_support' => 'required|string',
            'details.*.items.*.remarks' => 'required|string',
            'details.*.items.*.ppmp_ref' => 'required|string',
        ]);
        $total_budget = 0;
        foreach ($validated['details'] as $detail) {
            foreach ($detail['items'] as $item) {
                $total_budget += $item['total'];
            }
        }
        $division = Auth::user()->division;

        // Auto-generate ppmp_no per division
        $lastPpmp = Ppmp::where('division', $division)
            ->latest('id')
            ->first();
        $nextNumber = $lastPpmp ? (intval(substr($lastPpmp->ppmp_no, -3)) + 1) : 1;
        $ppmpNo = 'PPMP-' . strtoupper(substr($division, 0, 3)) . '-' . date('Y') . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Create PPMP with expected_budget
        $ppmp = Ppmp::create([
            'ppmp_no' => $ppmpNo,
            'user_id' => Auth::user()->id,
            'status_plan' => $validated['status_plan'] ?? 'indicative',
            'division' => $division,
            'status' => 'process',
            'approved_date' => "",
            'total' => $total_budget
        ]);

        // Create details with items
        foreach ($validated['details'] as $detailData) {
            // Create detail
            $detail = PpmpDetails::create([
                'ppmp_id' => $ppmp->id,
                'general_description' => $detailData['general_description']
            ]);

            // Create items for this detail
            foreach ($detailData['items'] as $itemData) {
                PpmpItems::create([
                    'ppmp_detail_id' => $detail->id,
                    'type_project' => $itemData['type_project'],
                    'qty_size' => $itemData['qty_size'],
                    'recommended' => $itemData['recommended'],
                    'ppc' => $itemData['ppc'],
                    'start_activity' => $itemData['start_activity'],
                    'end_activity' => $itemData['end_activity'],
                    'expected_delivery' => $itemData['expected_delivery'],
                    'source_funds' => $itemData['source_funds'],
                    'estimated_budget' => $itemData['estimated_budget'],
                    'total' => $itemData['total'],
                    'attached_support' => $itemData['attached_support'],
                    'remarks' => $itemData['remarks'],
                    'ppmp_ref' => $itemData['ppmp_ref']
                ]);
            }
        }

        return redirect()
            ->route('ppmp.show', $ppmp->id)
            ->with('success', 'PPMP plan created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
