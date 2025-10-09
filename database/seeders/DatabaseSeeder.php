<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'afmd@dti.com'],
            [
                'name' => 'Administrative Financial Management Division',
                'password' => Hash::make('dti12345'),
                'email_verified_at' => now(),
                'role' => 'user',
                'requester' => 'HAZEL E. HAUTEA',
                'position'=> 'Chief Administrative Officer',
                'division' => 'AFMD'
            ]
        );
        User::firstOrCreate(
            ['email' => 'cpd@dti.com'],
            [
                'name' => 'Consumer Protection Division',
                'password' => Hash::make('dti12345'),
                'email_verified_at' => now(),
                'role' => 'user',
                'requester' => 'Elbert Capecio',
                'position'=> 'Consumer Protection Chief',
                'division' => 'CPD'
            ]
        );
        User::firstOrCreate(
            ['email' => 'sdd@dti.com'],
            [
                'name' => 'Sme Development Division',
                'password' => Hash::make('dti12345'),
                'email_verified_at' => now(),
                'role' => 'user',
                'requester' => 'DAGNY A. MARTIRIZAR',
                'position'=> 'OIC, Industrial Department Division Chief',
                'division' => 'SDD'
            ]
        );
        User::firstOrCreate(
            ['email' => 'sdd@dti.com'],
            [
                'name' => 'Sme Development Division',
                'password' => Hash::make('dti12345'),
                'email_verified_at' => now(),
                'role' => 'user',
                'requester' => 'DAGNY A. MARTIRIZAR',
                'position'=> 'OIC, Industrial Department Division Chief',
                'division' => 'SDD'
            ]
        );
        User::firstOrCreate(
            ['email' => 'procurementunit@dti.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'requester' => 'Admin',
                'position'=> 'Procurement Unit',
                'division' => 'admin-AFMD'
            ]
        );

        $this->call([
            PurchaseRequestSeeder::class,
        ]);
    }
}
