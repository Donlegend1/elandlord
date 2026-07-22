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
                'name' => 'Sarah Sterling',
                'location' => 'Expats Community, Karen',
                'quote' => 'Marete & Co helped us find our dream home in Karen. Their attention to detail, discrete representation, and unmatched negotiation skills were outstanding.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'David Mwangi',
                'location' => 'Investor, Westlands',
                'quote' => 'I have worked with Marete & Co on several off-plan and land acquisitions. They are the most professional and transparent real estate advisory in Kenya.',
                'rating' => 5,
                'is_approved' => true,
            ],
            [
                'name' => 'H. E. Ambassador Jean-Pierre',
                'location' => 'Diplomatic Blue Zone, Runda',
                'quote' => 'Finding a home that meets our stringent security requirements was a challenge. Marete & Co delivered the perfect villa with speed and absolute privacy.',
                'rating' => 5,
                'is_approved' => true,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}
