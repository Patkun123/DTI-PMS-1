<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\Ppmp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Build a combined time-series for Purchase Requests and PPMPs for the last 90 days.
        $end = now()->endOfDay();
        $start = now()->subDays(89)->startOfDay(); // include today => 90 days total

        $prSeries = PurchaseRequest::select(
                DB::raw('DATE(requested_date) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->whereBetween('requested_date', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date')
            ->toArray();

        $ppmpSeries = Ppmp::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date')
            ->toArray();

        // Fill missing dates with zeroes so chart libraries have a continuous series.
        $chartData = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $d = $cursor->format('Y-m-d');
            $chartData[] = [
                'date' => $d,
                'purchaseRequest' => isset($prSeries[$d]) ? (int) $prSeries[$d] : 0,
                'ppmp' => isset($ppmpSeries[$d]) ? (int) $ppmpSeries[$d] : 0,
            ];
            $cursor->addDay();
        }

        $daily = PurchaseRequest::whereDate('created_at', Carbon::today())->count();
        $weekly = PurchaseRequest::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();
        $monthly = PurchaseRequest::whereMonth('created_at', Carbon::now()->month)->count();

        $complete = PurchaseRequest::where('status', 'approved')->count();
        $ongoing = PurchaseRequest::where('status', 'pending')->count();
        $cancelled = PurchaseRequest::where('status', 'cancelled')->count();

        return inertia('dashboard', [
            'stats' => [
                'daily' => $daily,
                'weekly' => $weekly,
                'monthly' => $monthly,
                'complete' => $complete,
                'ongoing' => $ongoing,
                'cancelled' => $cancelled,
                'chartData' => $chartData,
            ],
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
