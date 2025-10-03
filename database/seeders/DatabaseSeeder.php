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
                'role' => 'admin',
                'requester' => 'HAZEL E. HAUTEA',
                'position'=> 'Chief Administrative Officer',
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
            ]
        );
        User::firstOrCreate(
            ['email' => 'sdd@dti.com'],
            [
                'name' => 'SME DEVELOPMENT DIVISION',
                'password' => Hash::make('dti12345'),
                'email_verified_at' => now(),
                'role' => 'user',
                'requester' => 'DAGNY A. MARTIRIZAR',
                'position'=> 'OIC, Industrial Department Division Chief',
            ]
        );

        $this->call([
            PurchaseRequestSeeder::class,
        ]);
    }
}
