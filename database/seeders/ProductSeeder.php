<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'slug' => 'luxury-5-bedroom-villa-karen',
                'category' => 'sale',
                'name' => 'Luxury 5-Bedroom Villa in Karen',
                'tagline' => 'A magnificent property offering luxury and privacy in Nairobi\'s premier suburb.',
                'description' => 'This stunning 5-bedroom villa is situated in a secure, gated community in Karen. Spanning over 6,500 sq ft, the house features a grand double-height entrance hall, expansive living room with fireplace, modern open-plan kitchen, formal dining area, and a home office. All five bedrooms are ensuite, with the master suite boasting a private balcony, walk-in closet, and jacuzzi. Externally, the property offers a landscaped 0.5-acre garden, swimming pool, staff quarters for two, and parking for four cars.',
                'specs' => [
                    'price' => 'KES 120,000,000',
                    'location' => 'Karen, Nairobi',
                    'type' => 'Villa',
                    'bedrooms' => 5,
                    'bathrooms' => 6,
                    'area' => '6,500 sq ft',
                    'status' => 'For Sale',
                    'amenities' => ['Swimming Pool', 'En-suite Bedrooms', 'Gated Community', 'Staff Quarters', 'Landscaped Garden', 'Backup Generator'],
                ],
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'sort' => 1,
            ],
            [
                'slug' => '3-bedroom-penthouse-kilimani',
                'category' => 'sale',
                'name' => 'Ultra-Modern 3-Bedroom Penthouse',
                'tagline' => 'Exceptional luxury living with panoramic views of the Nairobi skyline.',
                'description' => 'Located in the heart of Kilimani, this spectacular penthouse offers top-tier finishes and design. It features a spacious open-plan living and dining area, custom Italian kitchen, private terrace, and 3 ensuite bedrooms. The building amenities include an infinity pool, fully equipped gym, high-speed lifts, borehole, solar water heating, and 24/7 security.',
                'specs' => [
                    'price' => 'KES 35,000,000',
                    'location' => 'Kilimani, Nairobi',
                    'type' => 'Penthouse',
                    'bedrooms' => 3,
                    'bathrooms' => 4,
                    'area' => '3,200 sq ft',
                    'status' => 'For Sale',
                    'amenities' => ['Infinity Pool', 'Gym', 'Sky Terrace', 'Borehole', 'Solar Heating', 'High-speed Lifts'],
                ],
                'image' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'sort' => 2,
            ],
            [
                'slug' => '5-bedroom-house-runda',
                'category' => 'rental',
                'name' => 'Elegant 5-Bedroom Executive Mansion',
                'tagline' => 'Stunning family home close to UN agencies and international schools.',
                'description' => 'This classic Runda home is perfect for diplomatic or corporate families. It comprises a spacious lounge opening to a covered patio, separate dining room, modern kitchen with pantry, family/TV room, study, and five ensuite bedrooms. The property sits on a lush 0.5-acre plot with mature trees, electric fence, guard house, and double garage.',
                'specs' => [
                    'price' => 'KES 450,000 / month',
                    'location' => 'Runda, Nairobi',
                    'type' => 'Mansion',
                    'bedrooms' => 5,
                    'bathrooms' => 5,
                    'area' => '5,800 sq ft',
                    'status' => 'For Rent',
                    'amenities' => ['Mature Garden', 'Diplomatic Security', 'Guard House', 'Electric Fence', 'Family Room', 'Borehole'],
                ],
                'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'sort' => 3,
            ],
            [
                'slug' => '2-bedroom-apartment-westlands',
                'category' => 'rental',
                'name' => 'Chic 2-Bedroom Furnished Apartment',
                'tagline' => 'A stylish urban retreat in Nairobi\'s vibrant commercial hub.',
                'description' => 'Fully furnished to a high standard, this apartment in Westlands is ideal for business travelers or professionals. It features a cozy living space, fully fitted kitchen, balcony, and two bedrooms. Amenities include a rooftop lounge, swimming pool, gym, laundry facilities, and ample parking.',
                'specs' => [
                    'price' => 'KES 180,000 / month',
                    'location' => 'Westlands, Nairobi',
                    'type' => 'Apartment',
                    'bedrooms' => 2,
                    'bathrooms' => 2,
                    'area' => '1,500 sq ft',
                    'status' => 'For Rent',
                    'amenities' => ['Fully Furnished', 'Rooftop Lounge', 'Swimming Pool', 'Gym', 'Balcony', 'Laundry Services'],
                ],
                'image' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                'sort' => 4,
            ],
            [
                'slug' => 'half-acre-land-karen',
                'category' => 'land',
                'name' => 'Prime 0.5-Acre Residential Plot',
                'tagline' => 'The perfect canvas to build your dream home in a leafy enclave.',
                'description' => 'This flat, rectangular half-acre plot is located in a quiet and highly desirable part of Karen. The land is fully fenced, has red soil, mature trees, and ready connection to electricity and water. Clean title deed is available.',
                'specs' => [
                    'price' => 'KES 42,000,000',
                    'location' => 'Karen, Nairobi',
                    'type' => 'Land',
                    'bedrooms' => 0,
                    'bathrooms' => 0,
                    'area' => '0.5 Acres',
                    'status' => 'For Sale',
                    'amenities' => ['Red Soil', 'Mature Trees', 'Water Hookup', 'Electricity Available', 'Fully Fenced', 'Clean Title'],
                ],
                'image' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                'sort' => 5,
            ],
            [
                'slug' => 'off-plan-apartments-lavington',
                'category' => 'off-plan',
                'name' => 'The Oasis: Off-Plan 1 & 2 Bedroom Apartments',
                'tagline' => 'High return on investment in a premier residential neighborhood.',
                'description' => 'Invest in Lavington\'s newest premium development. The Oasis offers luxurious 1 and 2-bedroom units with high-quality contemporary finishes, open-plan spaces, and balconies. Projected completion date: Dec 2027. Flexible payment plans available (20% deposit, balance over construction period).',
                'specs' => [
                    'price' => 'From KES 8,500,000',
                    'location' => 'Lavington, Nairobi',
                    'type' => 'Off-Plan Apartment',
                    'bedrooms' => 1,
                    'bathrooms' => 1,
                    'area' => '850 - 1,400 sq ft',
                    'status' => 'Off-Plan',
                    'amenities' => ['Flexible Payment Plan', 'Show House Ready', 'Rooftop Terrace', 'Gym', 'Back-up Generator', 'Kids Play Area'],
                ],
                'image' => 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
                'sort' => 6,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
