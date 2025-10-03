<?php

namespace Database\Seeders;

use App\Models\PurchaseRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class PurchaseRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sampleRequests = [
            [
                'stock_no' => 1,
                'item_description' => 'PROCUREMENT OF THE PROFESSIONAL SERVICES OF MUSICAL TRAINER AND MUSICAL DIRECTOR FOR DTI-12 CHORALE TEAM',
                'quantity' => 1,
                'unit' => 'pc',
                'purpose'=> 'asdasdsa',
                'unit_cost' => 50000.00,
                'total_cost' => 50000.00,
                'status' => 'approved',
                'user_id'=> 2,
                'requested_date' => now()->subDays(5),
            ],
            [
                'stock_no' => 2,
                'item_description' => 'HIGH-PERFORMANCE LAPTOPS WITH 16GB RAM, 512GB SSD, INTEL I7 PROCESSOR',
                'quantity' => 5,
                'unit' => 'pc',
                'purpose'=> 'asdasdsa',
                'unit_cost' => 3000.00,
                'total_cost' => 15000.00,
                'status' => 'approved',
                'user_id'=> 1,
                'requested_date' => now()->subDays(10),
            ],
            [
                'stock_no' => 3,
                'item_description' => 'PRINTING AND PROMOTIONAL MATERIALS FOR PRODUCT LAUNCH CAMPAIGN',
                'quantity' => 1,
                'unit_cost' => 5000.00,
                'total_cost' => 5000.00,
                'status' => 'pending',
                'unit' => 'box',
                'purpose'=> 'asdasdsa',
                'user_id'=> 1,
                'requested_date' => now(),
            ],
            [
                'stock_no' => 4,
                'item_description' => 'NEW CONFERENCE TABLE AND CHAIRS FOR THE MAIN MEETING ROOM',
                'quantity' => 1,
                'unit_cost' => 8000.00,
                'total_cost' => 8000.00,
                'status' => 'approved',
                'unit' => 'liter',
                'purpose'=> 'asdasdsa',
                'user_id'=> 1,
                'requested_date' => now()->subDays(30),
            ],
            [
                'stock_no' => 5,
                'item_description' => 'ANNUAL RENEWAL OF SOFTWARE LICENSES FOR DESIGN AND DEVELOPMENT TOOLS',
                'quantity' => 1,
                'unit_cost' => 12000.00,
                'total_cost' => 12000.00,
                'status' => 'pending',
                'unit' => 'stock',
                'purpose'=> 'asdasdsa',
                'user_id'=> 3,
                'requested_date' => now()->subDays(15),
            ],
        ];

        foreach ($sampleRequests as $requestData) {
            $purchaseRequest = new PurchaseRequest($requestData);
            $purchaseRequest->pr_number = $purchaseRequest->generatePrNumber();
            $purchaseRequest->save();
        }
    }
}
