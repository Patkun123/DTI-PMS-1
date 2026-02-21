<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

//admin
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    // Purchase Request routes
    Route::resource('purchase-requests', App\Http\Controllers\PurchaseRequestController::class);
    Route::get('purchase-requests/{purchaseRequest}/print', [App\Http\Controllers\PurchaseRequestController::class, 'print'])->name('purchase-requests.print');
    Route::get('purchase-requests/{purchaseRequest}/print-with-ris', [App\Http\Controllers\PurchaseRequestController::class, 'printwithris'])->name('requisitions.print');
    Route::post('/purchase-requests/{purchaseRequest}/approve', [App\Http\Controllers\PurchaseRequestController::class, 'approve'])->name('purchase-requests.approve');
    Route::post('/purchase-requests/{purchaseRequest}/complete', [App\Http\Controllers\PurchaseRequestController::class, 'complete'])->name('purchase-requests.complete');

    //PPMP Route
    Route::resource('ppmp', App\Http\Controllers\PpmpController::class);
    Route::get('/ppmp/{ppmp}/print', [App\Http\Controllers\PpmpController::class, 'print'])->name('ppmp.print');

    // Source of Funds Route
    Route::resource('source-of-funds', App\Http\Controllers\SourceOfFundController::class);


    // User Management Routes
    Route::prefix('admin/users')->name('admin.users.')->group(function () {
        Route::get('/', [App\Http\Controllers\Usermanagement::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Usermanagement::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Usermanagement::class, 'store'])->name('store');
        Route::get('/{user}', [App\Http\Controllers\Usermanagement::class, 'show'])->name('show');
        Route::get('/{user}/edit', [App\Http\Controllers\Usermanagement::class, 'edit'])->name('edit');
        Route::put('/{user}', [App\Http\Controllers\Usermanagement::class, 'update'])->name('update');
        Route::delete('/{user}', [App\Http\Controllers\Usermanagement::class, 'destroy'])->name('destroy');
    });

    // Legacy route for backward compatibility
    Route::get('user-management/index', [App\Http\Controllers\Usermanagement::class, 'index'])->name('usermanagementindex');
});

//user
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('userdashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
