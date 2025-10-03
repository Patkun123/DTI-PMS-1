<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Purchase Request routes
    Route::resource('purchase-requests', App\Http\Controllers\PurchaseRequestController::class);
    Route::get('purchase-requests/{purchaseRequest}/print', [App\Http\Controllers\PurchaseRequestController::class, 'print'])->name('purchase-requests.print');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
