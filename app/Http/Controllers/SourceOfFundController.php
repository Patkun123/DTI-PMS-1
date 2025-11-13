<?php

namespace App\Http\Controllers;

use App\Models\SourceOfFund;
use App\Http\Requests\SourceOfFundRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SourceOfFundController extends Controller
{
    public function __construct()
    {
        // routes already protected by middleware in routes/web.php; no constructor middleware needed
    }

    public function index(Request $request)
    {
        $query = SourceOfFund::query();

        if ($request->filled('division')) {
            $query->where('division', $request->division);
        }

        $items = $query->orderBy('name')->paginate(25);

        // collect divisions from existing PPMP or users if available
        $divisions = SourceOfFund::select('division')->whereNotNull('division')->distinct()->orderBy('division')->pluck('division');

        return Inertia::render('source-of-funds/index', [
            'source_of_funds' => $items,
            'divisions' => $divisions,
        ]);
    }

    public function create()
    {
        $divisions = SourceOfFund::select('division')->whereNotNull('division')->distinct()->orderBy('division')->pluck('division');
        return Inertia::render('source-of-funds/create', [
            'divisions' => $divisions,
        ]);
    }

    public function store(SourceOfFundRequest $request)
    {
        SourceOfFund::create($request->validated());
        return redirect()->route('source-of-funds.index')->with('success', 'Source of fund created.');
    }

    public function edit(SourceOfFund $source_of_fund)
    {
        $divisions = SourceOfFund::select('division')->whereNotNull('division')->distinct()->orderBy('division')->pluck('division');
        return Inertia::render('source-of-funds/edit', [
            'item' => $source_of_fund,
            'divisions' => $divisions,
        ]);
    }

    public function update(SourceOfFundRequest $request, SourceOfFund $source_of_fund)
    {
        $source_of_fund->update($request->validated());
        return redirect()->route('source-of-funds.index')->with('success', 'Source of fund updated.');
    }

    public function destroy(SourceOfFund $source_of_fund)
    {
        $source_of_fund->delete();
        return back()->with('success', 'Deleted.');
    }
}
