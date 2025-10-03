<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $purchaseRequests = PurchaseRequest::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('purchase-requests/index', [
            'purchaseRequests' => $purchaseRequests,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('purchase-requests/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'stock_no' => 'required|integer|min:1',
            'item_description' => 'required|string|max:1000',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
            'status' => 'sometimes|in:pending,approved',
            'requested_date' => 'required|date',
        ]);

        $purchaseRequest = new PurchaseRequest($validated);
        $purchaseRequest->user_id = Auth::id();
        $purchaseRequest->pr_number = $purchaseRequest->generatePrNumber();
        $purchaseRequest->save();

        return redirect()->route('purchase-requests.index')
            ->with('success', 'Purchase request created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseRequest $purchaseRequest): Response
    {
        $purchaseRequest->load('user');

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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseRequest $purchaseRequest)
    {
        $validated = $request->validate([
            'stock_no' => 'required|integer|min:1',
            'item_description' => 'required|string|max:1000',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
            'status' => 'sometimes|in:pending,approved',
            'requested_date' => 'required|date',
        ]);

        $purchaseRequest->update($validated);

        return redirect()->route('purchase-requests.index')
            ->with('success', 'Purchase request updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->delete();

        return redirect()->route('purchase-requests.index')
            ->with('success', 'Purchase request deleted successfully.');
    }

    /**
     * Display the print view for the specified resource.
     */
    public function print(PurchaseRequest $purchaseRequest): Response
    {
        $purchaseRequest->load('user');

        return Inertia::render('purchase-requests/print', [
            'purchaseRequest' => $purchaseRequest,
        ]);
    }
}
