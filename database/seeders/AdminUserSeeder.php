<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@mareteandco.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('MareteAdmin2026!'),
                'email_verified_at' => now(),
            ]
        );
    }
}
