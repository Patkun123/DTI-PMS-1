<?php

namespace Database\Seeders;

use App\Models\PurchaseRequest;
use App\Models\Ppmp;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PurchaseRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Get available PPMPs for linking purchase requests
            $ppmpAfmd = Ppmp::where('division', 'AFMD')->first();
            $ppmpCpd = Ppmp::where('division', 'CPD')->first();
            $ppmpSdd = Ppmp::where('division', 'SDD')->first();
            $ppmpIdd = Ppmp::where('division', 'IDD')->first();

            // Sample purchase requests with PPMP references
            $requests = [
                [
                    'user_id' => 2, // CPD
                    'ppmp_id' => $ppmpCpd?->id,
                    'purpose' => 'Procurement of musical trainer and director services for DTI-12 Chorale Team',
                    'status' => 'cancelled',
                    'ris_status' => 'with',
                    'requested_date' => now()->subDays(5),
                    'items' => [
                        [
                            'stock_no' => 1,
                            'item_description' => 'Professional Services of Musical Trainer',
                            'quantity' => 1,
                            'unit' => 'pc',
                            'unit_cost' => 30000.00,
                            'total_cost' => 30000.00,
                        ],
                        [
                            'stock_no' => 2,
                            'item_description' => 'Professional Services of Musical Director',
                            'quantity' => 1,
                            'unit' => 'pc',
                            'unit_cost' => 20000.00,
                            'total_cost' => 20000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 1, // AFMD
                    'ppmp_id' => $ppmpAfmd?->id,
                    'purpose' => 'Office equipment upgrade project',
                    'status' => 'completed',
                    'ris_status' => 'none',
                    'requested_date' => now()->subDays(10),
                    'items' => [
                        [
                            'stock_no' => 10,
                            'item_description' => 'High-performance Laptop, Intel i7, 16GB RAM, 512GB SSD',
                            'quantity' => 5,
                            'unit' => 'pc',
                            'unit_cost' => 3000.00,
                            'total_cost' => 15000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 1, // AFMD
                    'ppmp_id' => $ppmpAfmd?->id,
                    'purpose' => 'Promotional materials for product launch campaign',
                    'status' => 'ongoing',
                    'ris_status' => 'with',
                    'requested_date' => now(),
                    'items' => [
                        [
                            'stock_no' => 20,
                            'item_description' => 'Printing and promotional materials (flyers, banners, posters)',
                            'quantity' => 1,
                            'unit' => 'box',
                            'unit_cost' => 5000.00,
                            'total_cost' => 5000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 1, // AFMD
                    'ppmp_id' => $ppmpAfmd?->id,
                    'purpose' => 'Office furniture replacement',
                    'status' => 'approved',
                    'ris_status' => 'none',
                    'requested_date' => now()->subDays(30),
                    'items' => [
                        [
                            'stock_no' => 30,
                            'item_description' => 'Conference Table (10-seater)',
                            'quantity' => 1,
                            'unit' => 'set',
                            'unit_cost' => 6000.00,
                            'total_cost' => 6000.00,
                        ],
                        [
                            'stock_no' => 31,
                            'item_description' => 'Conference Chairs',
                            'quantity' => 10,
                            'unit' => 'pc',
                            'unit_cost' => 200.00,
                            'total_cost' => 2000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 3, // SDD
                    'ppmp_id' => $ppmpSdd?->id,
                    'purpose' => 'Annual software license renewal',
                    'status' => 'ongoing',
                    'ris_status' => 'with',
                    'requested_date' => now()->subDays(15),
                    'items' => [
                        [
                            'stock_no' => 40,
                            'item_description' => 'Adobe Creative Cloud License',
                            'quantity' => 1,
                            'unit' => 'license',
                            'unit_cost' => 7000.00,
                            'total_cost' => 7000.00,
                        ],
                        [
                            'stock_no' => 41,
                            'item_description' => 'Microsoft Office 365 License',
                            'quantity' => 1,
                            'unit' => 'license',
                            'unit_cost' => 5000.00,
                            'total_cost' => 5000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 4, // IDD
                    'ppmp_id' => $ppmpIdd?->id,
                    'purpose' => 'ICT equipment procurement for digital transformation',
                    'status' => 'ongoing',
                    'ris_status' => 'with',
                    'requested_date' => now()->subDays(7),
                    'items' => [
                        [
                            'stock_no' => 50,
                            'item_description' => 'Network Switch 24-port Gigabit',
                            'quantity' => 2,
                            'unit' => 'pc',
                            'unit_cost' => 15000.00,
                            'total_cost' => 30000.00,
                        ],
                        [
                            'stock_no' => 51,
                            'item_description' => 'Wireless Access Points',
                            'quantity' => 4,
                            'unit' => 'pc',
                            'unit_cost' => 8000.00,
                            'total_cost' => 32000.00,
                        ],
                    ],
                ],
                [
                    'user_id' => 2, // CPD
                    'ppmp_id' => $ppmpCpd?->id,
                    'purpose' => 'Consumer protection awareness materials',
                    'status' => 'approved',
                    'ris_status' => 'none',
                    'requested_date' => now()->subDays(20),
                    'items' => [
                        [
                            'stock_no' => 60,
                            'item_description' => 'Educational brochures and flyers',
                            'quantity' => 1000,
                            'unit' => 'pc',
                            'unit_cost' => 5.00,
                            'total_cost' => 5000.00,
                        ],
                    ],
                ],
            ];

            foreach ($requests as $requestData) {
                // Skip if PPMP doesn't exist
                if (!$requestData['ppmp_id']) {
                    continue;
                }

                $items = $requestData['items'];
                unset($requestData['items']);

                // Generate PR number
                $purchaseRequest = new PurchaseRequest($requestData);
                $purchaseRequest->pr_number = $purchaseRequest->generatePrNumber($requestData['user_id']);

                // Generate RIS number only if status is 'with'
                $withRis = ($requestData['ris_status'] ?? 'none') === 'with';
                $purchaseRequest->ris_number = PurchaseRequest::generateRisNumber($requestData['user_id'], $withRis);

                $purchaseRequest->save();

                // Attach items
                $purchaseRequest->items()->createMany($items);

                // Update PPMP budget after creating purchase request
                if ($purchaseRequest->ppmp) {
                    $purchaseRequest->ppmp->updateBudgetAndStatus();
                }
            }
        });
    }
}
