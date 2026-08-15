<?php

namespace Database\Seeders;

use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\PaymentReceipt;
use App\Models\Property;
use App\Models\PropertyAssignment;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin
        $superAdmin = User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@elandlord.com',
            'role' => 'super_admin',
            'phone' => '+1 (555) 000-1111',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 2. Landlord / Owner
        $landlord = User::create([
            'name' => 'Alexander Sterling (Landlord)',
            'email' => 'landlord@elandlord.com',
            'role' => 'landlord',
            'phone' => '+1 (555) 222-3333',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 3. Assistant (created by landlord)
        $assistant = User::create([
            'name' => 'Sarah Connor (Property Assistant)',
            'email' => 'assistant@elandlord.com',
            'role' => 'assistant',
            'phone' => '+1 (555) 444-5555',
            'created_by_user_id' => $landlord->id,
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 4. Agent
        $agent = User::create([
            'name' => 'Michael Vance (Realty Agent)',
            'email' => 'agent@elandlord.com',
            'role' => 'agent',
            'phone' => '+1 (555) 666-7777',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // 5. Tenants
        $tenant1 = User::create([
            'name' => 'John Doe (Tenant)',
            'email' => 'tenant@elandlord.com',
            'role' => 'tenant',
            'phone' => '+1 (555) 888-9999',
            'created_by_user_id' => $landlord->id,
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $tenant2 = User::create([
            'name' => 'Emily Smith (Tenant)',
            'email' => 'tenant2@elandlord.com',
            'role' => 'tenant',
            'phone' => '+1 (555) 999-0000',
            'created_by_user_id' => $landlord->id,
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        \App\Models\TenantProfile::create([
            'user_id' => $tenant1->id,
            'identification_type' => 'passport',
            'identification_number' => 'P1234567',
            'occupation' => 'Analyst',
            'emergency_contact_name' => 'Mary Doe',
            'emergency_contact_relationship' => 'Spouse',
            'emergency_contact_phone' => '+1 (555) 111-2222',
        ]);

        \App\Models\TenantProfile::create([
            'user_id' => $tenant2->id,
            'identification_type' => 'national_id',
            'identification_number' => 'NIN-998877',
            'occupation' => 'Teacher',
            'emergency_contact_name' => 'Paul Smith',
            'emergency_contact_relationship' => 'Brother',
            'emergency_contact_phone' => '+1 (555) 333-4444',
        ]);

        // Create Properties
        $prop1 = Property::create([
            'landlord_id' => $landlord->id,
            'name' => 'Victoria Heights Luxury Apartments',
            'address' => '742 Evergreen Terrace',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62701',
            'type' => 'residential',
            'description' => 'Modern luxury residential building with underground parking, rooftop pool, and 24/7 security.',
            'total_units' => 3,
        ]);

        $prop2 = Property::create([
            'landlord_id' => $landlord->id,
            'name' => 'Sunrise Commercial Plaza',
            'address' => '100 Financial Way',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62702',
            'type' => 'commercial',
            'description' => 'Prime commercial office spaces with high foot traffic and fiber internet infrastructure.',
            'total_units' => 2,
        ]);

        $prop3 = Property::create([
            'landlord_id' => $landlord->id,
            'name' => 'Palm View Executive Villas',
            'address' => '12 Ocean Drive',
            'city' => 'Springfield',
            'state' => 'IL',
            'zip' => '62703',
            'type' => 'multi-family',
            'description' => 'Exclusive gated villa community with private gardens.',
            'total_units' => 2,
        ]);

        // Assign Properties 1 & 2 to Assistant
        PropertyAssignment::create([
            'user_id' => $assistant->id,
            'property_id' => $prop1->id,
            'role_assigned' => 'assistant',
        ]);

        PropertyAssignment::create([
            'user_id' => $assistant->id,
            'property_id' => $prop2->id,
            'role_assigned' => 'assistant',
        ]);

        // Create Units
        $unit1A = Unit::create([
            'property_id' => $prop1->id,
            'unit_number' => 'Apt 1A',
            'rent_amount' => 1800.00,
            'deposit_amount' => 1800.00,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'status' => 'occupied',
        ]);

        $unit1B = Unit::create([
            'property_id' => $prop1->id,
            'unit_number' => 'Apt 1B',
            'rent_amount' => 2200.00,
            'deposit_amount' => 2200.00,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'status' => 'occupied',
        ]);

        $unit1C = Unit::create([
            'property_id' => $prop1->id,
            'unit_number' => 'Penthouse 301',
            'rent_amount' => 3500.00,
            'deposit_amount' => 3500.00,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'status' => 'vacant',
        ]);

        $unit2A = Unit::create([
            'property_id' => $prop2->id,
            'unit_number' => 'Suite 101',
            'rent_amount' => 3000.00,
            'deposit_amount' => 3000.00,
            'bedrooms' => 0,
            'bathrooms' => 1,
            'status' => 'vacant',
        ]);

        // Create Leases
        $lease1 = Lease::create([
            'tenant_user_id' => $tenant1->id,
            'property_id' => $prop1->id,
            'unit_id' => $unit1A->id,
            'landlord_id' => $landlord->id,
            'lease_start' => now()->subMonths(6)->toDateString(),
            'lease_end' => now()->addDays(25)->toDateString(), // Expiring in 25 days!
            'rent_amount' => 1800.00,
            'security_deposit' => 1800.00,
            'payment_cycle' => 'monthly',
            'status' => 'active',
            'notes' => 'Tenant requested renewal discussion early.',
        ]);

        $lease2 = Lease::create([
            'tenant_user_id' => $tenant2->id,
            'property_id' => $prop1->id,
            'unit_id' => $unit1B->id,
            'landlord_id' => $landlord->id,
            'lease_start' => now()->subMonths(3)->toDateString(),
            'lease_end' => now()->addMonths(9)->toDateString(),
            'rent_amount' => 2200.00,
            'security_deposit' => 2200.00,
            'payment_cycle' => 'monthly',
            'status' => 'active',
        ]);

        // Create Receipts
        PaymentReceipt::create([
            'receipt_number' => 'EL-2026-000101',
            'lease_id' => $lease1->id,
            'tenant_user_id' => $tenant1->id,
            'property_id' => $prop1->id,
            'unit_id' => $unit1A->id,
            'amount' => 1800.00,
            'payment_date' => now()->subDays(15)->toDateString(),
            'period_covered' => now()->format('F Y'),
            'payment_method' => 'bank_transfer',
            'transaction_reference' => 'TRX-99882211',
            'notes' => 'Rent payment received on time.',
            'created_by_user_id' => $landlord->id,
        ]);

        PaymentReceipt::create([
            'receipt_number' => 'EL-2026-000102',
            'lease_id' => $lease2->id,
            'tenant_user_id' => $tenant2->id,
            'property_id' => $prop1->id,
            'unit_id' => $unit1B->id,
            'amount' => 2200.00,
            'payment_date' => now()->subDays(5)->toDateString(),
            'period_covered' => now()->format('F Y'),
            'payment_method' => 'online_card',
            'transaction_reference' => 'CARD-11223344',
            'notes' => 'Paid via online portal.',
            'created_by_user_id' => $assistant->id,
        ]);

        // Maintenance Request
        MaintenanceRequest::create([
            'tenant_user_id' => $tenant1->id,
            'property_id' => $prop1->id,
            'unit_id' => $unit1A->id,
            'title' => 'Water Leakage under Kitchen Sink',
            'description' => 'Small water drip coming from the cold water pipe beneath the kitchen sink counter.',
            'priority' => 'medium',
            'status' => 'in_progress',
        ]);

        // Approved Testimonials for E-Landlord
        \App\Models\Testimonial::create([
            'name' => 'Marcus Vance',
            'location' => 'Property Owner, Springfield',
            'quote' => 'E-Landlord completely simplified how I manage my 12 rental units. Assigning my assistant Sarah to manage 8 of the units while keeping full financial oversight has saved me hours every week!',
            'rating' => 5,
            'is_approved' => true,
        ]);

        \App\Models\Testimonial::create([
            'name' => 'Elena Rostova',
            'location' => 'Assistant Manager',
            'quote' => 'The assistant portal is brilliant. I can instantly issue digital payment receipts with official invoice numbers right after tenants pay their rent, and they receive them immediately.',
            'rating' => 5,
            'is_approved' => true,
        ]);

        \App\Models\Testimonial::create([
            'name' => 'David Miller',
            'location' => 'Tenant at Victoria Heights',
            'quote' => 'Having a tenant portal to download printable rent receipts, check my lease end dates, and submit maintenance tickets directly to the property manager is super convenient!',
            'rating' => 5,
            'is_approved' => true,
        ]);

        $this->call(LegalPageSeeder::class);
    }
}
