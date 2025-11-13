<?php

namespace Database\Seeders;

use App\Models\system_details;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        system_details::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Department of Trade and Industry - Region XII',
                'regional_director' => 'Dr. Ibrahim K. Guiamadel',
            ]
        );
    }
}
