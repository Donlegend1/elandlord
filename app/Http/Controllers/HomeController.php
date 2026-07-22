<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Query featured properties
        $products = Product::latest()->take(6)->get();

        $stats = [
            ['value' => 'KES 15B+', 'label' => 'Property Portfolio Managed'],
            ['value' => '500+', 'label' => 'Luxury Homes Handled'],
            ['value' => '12+', 'label' => 'Years of Excellence in Nairobi'],
            ['value' => '98%', 'label' => 'Client Satisfaction Rate'],
        ];

        // Fetch approved testimonials dynamically
        $testimonials = Testimonial::where('is_approved', true)->latest()->get();

        $faqs = [
            [
                'q' => 'Can foreigners buy property in Kenya?',
                'a' => 'Yes, foreigners can purchase land and buildings in Kenya. However, under the Constitution, foreigners can only hold leasehold land for a term of up to 99 years, not freehold agricultural land, unless special exemptions apply.',
            ],
            [
                'q' => 'What is the property buying process in Kenya?',
                'a' => 'The process includes: 1) Selecting a property and signing an offer letter; 2) Performing an official search of the title deed; 3) Drafting and signing a Sale Agreement; 4) Paying the deposit (usually 10%-20%); 5) Paying stamp duty and registering the transfer of title under legal representation.',
            ],
            [
                'q' => 'How much is stamp duty in Kenya?',
                'a' => 'Stamp duty is a tax paid to the government on property transfers. It is currently 4% of the property value for properties within municipalities/cities (like Nairobi) and 2% for properties in rural areas.',
            ],
            [
                'q' => 'Do you manage rental properties on behalf of landlords?',
                'a' => 'Yes, Marete & Co Realty offers full-service property management. We handle tenant sourcing, vetting, rent collection, routine maintenance, and monthly financial reporting, giving landlords complete peace of mind.',
            ],
            [
                'q' => 'What is an off-plan property investment?',
                'a' => 'Off-plan means purchasing a property before it is constructed, based on architectural designs and models. It offers lower pricing than completed projects and provides flexible payment plans over the construction period, yielding excellent capital gains.',
            ],
        ];

        return Inertia::render('Home', [
            'products' => $products,
            'stats' => $stats,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
        ]);
    }
}
