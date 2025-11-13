<?php

namespace Database\Seeders;

use App\Models\Ppmp;
use App\Models\PpmpDetails;
use App\Models\PpmpItems;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PpmpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Sample PPMPs with budget tracking
            $ppmpData = [
                [
                    'user_id' => 1, // AFMD
                    'status_plan' => 'final',
                    'division' => 'AFMD',
                    'status' => 'process',
                    'allocated_budget' => 500000.00,
                    'source_funds' => 'GAA',
                    'details' => [
                        [
                            'general_description' => 'Office Equipment and Supplies',
                            'items' => [
                                [
                                    'detail' => 'Computer Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '5 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-01-01',
                                    'end_activity' => '2025-03-31',
                                    'expected_delivery' => '2025-03-15',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 75000.00,
                                    'attached_support' => 'Quotation from suppliers',
                                    'remarks' => 'High priority for Q1',
                                ],
                                [
                                    'detail' => 'Office Furniture',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 set',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-02-01',
                                    'end_activity' => '2025-04-30',
                                    'expected_delivery' => '2025-04-15',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 8000.00,
                                    'attached_support' => 'Office layout plan',
                                    'remarks' => 'Conference room upgrade',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Communication and Networking',
                            'items' => [
                                [
                                    'detail' => 'Telephone System',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 system',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-03-01',
                                    'end_activity' => '2025-05-31',
                                    'expected_delivery' => '2025-05-15',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 25000.00,
                                    'attached_support' => 'System specifications',
                                    'remarks' => 'Office communication upgrade',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Security and Safety Equipment',
                            'items' => [
                                [
                                    'detail' => 'Security Cameras',
                                    'type_project' => 'Goods',
                                    'qty_size' => '8 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-04-01',
                                    'end_activity' => '2025-06-30',
                                    'expected_delivery' => '2025-06-15',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 40000.00,
                                    'attached_support' => 'Security assessment report',
                                    'remarks' => 'Office security enhancement',
                                ],
                                [
                                    'detail' => 'Fire Safety Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '10 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-05-01',
                                    'end_activity' => '2025-07-31',
                                    'expected_delivery' => '2025-07-15',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 15000.00,
                                    'attached_support' => 'Safety compliance requirements',
                                    'remarks' => 'Fire safety compliance',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Maintenance and Repair Services',
                            'items' => [
                                [
                                    'detail' => 'HVAC Maintenance',
                                    'type_project' => 'Services',
                                    'qty_size' => '12 months',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-01-01',
                                    'end_activity' => '2025-12-31',
                                    'expected_delivery' => '2025-12-31',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 30000.00,
                                    'attached_support' => 'Maintenance contract',
                                    'remarks' => 'Annual HVAC maintenance',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Office Supplies and Materials',
                            'items' => [
                                [
                                    'detail' => 'Stationery and Office Supplies',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 year supply',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-01-01',
                                    'end_activity' => '2025-12-31',
                                    'expected_delivery' => '2025-12-31',
                                    'source_funds' => 'GAA',
                                    'estimated_budget' => 20000.00,
                                    'attached_support' => 'Annual supply requirements',
                                    'remarks' => 'Office operations support',
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'user_id' => 2, // CPD
                    'status_plan' => 'indicative',
                    'division' => 'CPD',
                    'status' => 'process',
                    'allocated_budget' => 300000.00,
                    'source_funds' => 'OTOP',
                    'details' => [
                        [
                            'general_description' => 'Consumer Protection Materials',
                            'items' => [
                                [
                                    'detail' => 'Educational Materials',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1000 pieces',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-01-15',
                                    'end_activity' => '2025-06-30',
                                    'expected_delivery' => '2025-06-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 5000.00,
                                    'attached_support' => 'Design specifications',
                                    'remarks' => 'Consumer awareness campaign',
                                ],
                                [
                                    'detail' => 'Training Materials',
                                    'type_project' => 'Goods',
                                    'qty_size' => '500 sets',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-03-01',
                                    'end_activity' => '2025-08-31',
                                    'expected_delivery' => '2025-08-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 1500.00,
                                    'attached_support' => 'Training curriculum',
                                    'remarks' => 'Staff training program',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Consumer Complaint Handling',
                            'items' => [
                                [
                                    'detail' => 'Complaint Management System',
                                    'type_project' => 'Services',
                                    'qty_size' => '1 system',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-02-01',
                                    'end_activity' => '2025-05-31',
                                    'expected_delivery' => '2025-05-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 45000.00,
                                    'attached_support' => 'System requirements',
                                    'remarks' => 'Digital complaint processing',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Consumer Education Programs',
                            'items' => [
                                [
                                    'detail' => 'Seminar Materials',
                                    'type_project' => 'Goods',
                                    'qty_size' => '200 sets',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-04-01',
                                    'end_activity' => '2025-09-30',
                                    'expected_delivery' => '2025-09-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 8000.00,
                                    'attached_support' => 'Seminar curriculum',
                                    'remarks' => 'Public education seminars',
                                ],
                                [
                                    'detail' => 'Audio-Visual Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '2 sets',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-05-01',
                                    'end_activity' => '2025-08-31',
                                    'expected_delivery' => '2025-08-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 35000.00,
                                    'attached_support' => 'Equipment specifications',
                                    'remarks' => 'Presentation equipment',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Consumer Rights Advocacy',
                            'items' => [
                                [
                                    'detail' => 'Legal Research Services',
                                    'type_project' => 'Services',
                                    'qty_size' => '6 months',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-06-01',
                                    'end_activity' => '2025-11-30',
                                    'expected_delivery' => '2025-11-30',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 25000.00,
                                    'attached_support' => 'Research contract',
                                    'remarks' => 'Consumer law research',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Consumer Protection Monitoring',
                            'items' => [
                                [
                                    'detail' => 'Market Monitoring Tools',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 set',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-07-01',
                                    'end_activity' => '2025-10-31',
                                    'expected_delivery' => '2025-10-15',
                                    'source_funds' => 'OTOP',
                                    'estimated_budget' => 15000.00,
                                    'attached_support' => 'Tool specifications',
                                    'remarks' => 'Market surveillance equipment',
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'user_id' => 3, // SDD
                    'status_plan' => 'final',
                    'division' => 'SDD',
                    'status' => 'process',
                    'allocated_budget' => 750000.00,
                    'source_funds' => 'GAD',
                    'details' => [
                        [
                            'general_description' => 'MSME Development Programs',
                            'items' => [
                                [
                                    'detail' => 'Training Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '10 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-02-01',
                                    'end_activity' => '2025-05-31',
                                    'expected_delivery' => '2025-05-15',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 250000.00,
                                    'attached_support' => 'Technical specifications',
                                    'remarks' => 'Skills training center',
                                ],
                                [
                                    'detail' => 'Marketing Materials',
                                    'type_project' => 'Goods',
                                    'qty_size' => '2000 pieces',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-04-01',
                                    'end_activity' => '2025-07-31',
                                    'expected_delivery' => '2025-07-15',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 5000.00,
                                    'attached_support' => 'Marketing plan',
                                    'remarks' => 'Product promotion',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'MSME Training and Capacity Building',
                            'items' => [
                                [
                                    'detail' => 'Training Venue Rental',
                                    'type_project' => 'Services',
                                    'qty_size' => '12 sessions',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-03-01',
                                    'end_activity' => '2025-08-31',
                                    'expected_delivery' => '2025-08-31',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 60000.00,
                                    'attached_support' => 'Venue rental contract',
                                    'remarks' => 'Training facility rental',
                                ],
                                [
                                    'detail' => 'Training Materials and Kits',
                                    'type_project' => 'Goods',
                                    'qty_size' => '100 sets',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-04-01',
                                    'end_activity' => '2025-09-30',
                                    'expected_delivery' => '2025-09-15',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 15000.00,
                                    'attached_support' => 'Training curriculum',
                                    'remarks' => 'Participant training kits',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'MSME Business Development Services',
                            'items' => [
                                [
                                    'detail' => 'Business Consultancy Services',
                                    'type_project' => 'Services',
                                    'qty_size' => '50 consultations',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-05-01',
                                    'end_activity' => '2025-10-31',
                                    'expected_delivery' => '2025-10-31',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 80000.00,
                                    'attached_support' => 'Consultancy contract',
                                    'remarks' => 'Business advisory services',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'MSME Technology Transfer',
                            'items' => [
                                [
                                    'detail' => 'Technology Demonstration Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '5 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-06-01',
                                    'end_activity' => '2025-11-30',
                                    'expected_delivery' => '2025-11-15',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 120000.00,
                                    'attached_support' => 'Equipment specifications',
                                    'remarks' => 'Technology showcase equipment',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'MSME Market Linkage Programs',
                            'items' => [
                                [
                                    'detail' => 'Trade Fair Participation',
                                    'type_project' => 'Services',
                                    'qty_size' => '4 events',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-07-01',
                                    'end_activity' => '2025-12-31',
                                    'expected_delivery' => '2025-12-31',
                                    'source_funds' => 'GAD',
                                    'estimated_budget' => 40000.00,
                                    'attached_support' => 'Event participation contract',
                                    'remarks' => 'Trade fair booth rental',
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'user_id' => 4, // IDD
                    'status_plan' => 'indicative',
                    'division' => 'IDD',
                    'status' => 'process',
                    'allocated_budget' => 1000000.00,
                    'source_funds' => 'MSME',
                    'details' => [
                        [
                            'general_description' => 'ICT Infrastructure Development',
                            'items' => [
                                [
                                    'detail' => 'Network Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 set',
                                    'recommended' => 'Public Bidding',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-01-01',
                                    'end_activity' => '2025-12-31',
                                    'expected_delivery' => '2025-12-15',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 500000.00,
                                    'attached_support' => 'Network design',
                                    'remarks' => 'Office network upgrade',
                                ],
                                [
                                    'detail' => 'Software Licenses',
                                    'type_project' => 'Goods',
                                    'qty_size' => '50 licenses',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-03-01',
                                    'end_activity' => '2025-09-30',
                                    'expected_delivery' => '2025-09-15',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 100000.00,
                                    'attached_support' => 'Software requirements',
                                    'remarks' => 'Productivity software',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'Digital Transformation Services',
                            'items' => [
                                [
                                    'detail' => 'System Integration Services',
                                    'type_project' => 'Services',
                                    'qty_size' => '6 months',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-02-01',
                                    'end_activity' => '2025-07-31',
                                    'expected_delivery' => '2025-07-31',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 150000.00,
                                    'attached_support' => 'Integration contract',
                                    'remarks' => 'System integration project',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'ICT Training and Development',
                            'items' => [
                                [
                                    'detail' => 'Staff ICT Training',
                                    'type_project' => 'Services',
                                    'qty_size' => '4 batches',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-04-01',
                                    'end_activity' => '2025-10-31',
                                    'expected_delivery' => '2025-10-31',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 80000.00,
                                    'attached_support' => 'Training contract',
                                    'remarks' => 'Digital literacy training',
                                ],
                                [
                                    'detail' => 'Training Equipment',
                                    'type_project' => 'Goods',
                                    'qty_size' => '20 units',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-05-01',
                                    'end_activity' => '2025-08-31',
                                    'expected_delivery' => '2025-08-15',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 60000.00,
                                    'attached_support' => 'Equipment specifications',
                                    'remarks' => 'Training lab equipment',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'ICT Security and Compliance',
                            'items' => [
                                [
                                    'detail' => 'Cybersecurity Software',
                                    'type_project' => 'Goods',
                                    'qty_size' => '1 license',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'No',
                                    'start_activity' => '2025-06-01',
                                    'end_activity' => '2025-11-30',
                                    'expected_delivery' => '2025-11-15',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 70000.00,
                                    'attached_support' => 'Security requirements',
                                    'remarks' => 'Network security software',
                                ],
                            ],
                        ],
                        [
                            'general_description' => 'ICT Maintenance and Support',
                            'items' => [
                                [
                                    'detail' => 'Annual Maintenance Contract',
                                    'type_project' => 'Services',
                                    'qty_size' => '12 months',
                                    'recommended' => 'Direct Purchase',
                                    'ppc' => 'Yes',
                                    'start_activity' => '2025-01-01',
                                    'end_activity' => '2025-12-31',
                                    'expected_delivery' => '2025-12-31',
                                    'source_funds' => 'MSME',
                                    'estimated_budget' => 40000.00,
                                    'attached_support' => 'Maintenance contract',
                                    'remarks' => 'ICT equipment maintenance',
                                ],
                            ],
                        ],
                    ],
                ],
            ];

            foreach ($ppmpData as $ppmpInfo) {
                $details = $ppmpInfo['details'];
                unset($ppmpInfo['details']);

                // Generate PPMP reference
                $ppmpRef = Ppmp::generatePpmpReference($ppmpInfo['source_funds']);

                // Generate PPMP number
                $ppmpNo = $this->generateNextPpmpNo($ppmpInfo['division']);

                // Calculate total estimated budget
                $totalBudget = 0;
                foreach ($details as $detail) {
                    foreach ($detail['items'] as $item) {
                        $totalBudget += $item['estimated_budget'];
                    }
                }

                // Create PPMP
                $ppmp = Ppmp::create([
                    'ppmp_no' => $ppmpNo,
                    'ppmp_ref' => $ppmpRef,
                    'user_id' => $ppmpInfo['user_id'],
                    'status_plan' => $ppmpInfo['status_plan'],
                    'division' => $ppmpInfo['division'],
                    'status' => $ppmpInfo['status'],
                    'approved_date' => null,
                    'total' => $totalBudget,
                    'allocated_budget' => $ppmpInfo['allocated_budget'],
                    'used_budget' => 0,
                    'remaining_budget' => $ppmpInfo['allocated_budget'],
                ]);

                // Create details and items
                foreach ($details as $index => $detailData) {
                    // Generate unique PPMP reference for each section
                    $sectionRef = $ppmpRef . '-' . str_pad($index + 1, 2, '0', STR_PAD_LEFT);

                    $detail = PpmpDetails::create([
                        'ppmp_id' => $ppmp->id,
                        'general_description' => $detailData['general_description'],
                        'ppmp_code' => $sectionRef, // Generate code like OTOP-2025-001-01
                    ]);

                    foreach ($detailData['items'] as $itemData) {
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
                            'source_funds' => $itemData['source_funds'],
                            'estimated_budget' => $itemData['estimated_budget'],
                            'attached_support' => $itemData['attached_support'],
                            'remarks' => $itemData['remarks'],
                            'ppmp_ref' => $sectionRef, // Use the unique section reference
                        ]);
                    }
                }
            }
        });
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
}
