<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

//admin
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Purchase Request routes
    Route::resource('purchase-requests', App\Http\Controllers\PurchaseRequestController::class);
    Route::get('purchase-requests/{purchaseRequest}/print', [App\Http\Controllers\PurchaseRequestController::class, 'print'])->name('purchase-requests.print');
    Route::get('purchase-requests/{purchaseRequest}/print-with-ris', [App\Http\Controllers\PurchaseRequestController::class, 'printwithris'])->name('requisitions.print');
    Route::post('/purchase-requests/{purchaseRequest}/approve', [App\Http\Controllers\PurchaseRequestController::class, 'approve'])
    ->middleware(['auth', 'verified'])
    ->name('purchase-requests.approve');

    // Route::resource('user-management', App\Http\Controllers\UserController::class);
    Route::get('user-management/index', [App\Http\Controllers\Usermanagement::class, 'index'])->name('usermanagementindex');
});

//user
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('user/dashboard', function(){
        return Inertia::render('user/dashboard');
    })->name('userdashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
