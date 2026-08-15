<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Marcus Vance',
                'location' => 'Property Owner, Springfield',
                'quote' => 'E-Landlord completely simplified how I manage my 12 rental units. Assigning my assistant Sarah to manage 8 of the units while keeping full financial oversight has saved me hours every week!',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'Elena Rostova',
                'location' => 'Assistant Manager',
                'quote' => 'The assistant portal is brilliant. I can instantly issue digital payment receipts with official invoice numbers right after tenants pay their rent, and they receive them immediately.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'David Miller',
                'location' => 'Tenant at Victoria Heights',
                'quote' => 'Having a tenant portal to download printable rent receipts, check my lease end dates, and submit maintenance tickets directly to the property manager is super convenient!',
                'rating' => 5,
                'is_approved' => true,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}
