<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\PaymentReceipt;
use App\Models\Property;
use App\Models\Testimonial;
use App\Models\Unit;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $stats = [
            ['value' => Property::count() ?: '50+', 'label' => 'Registered Properties'],
            ['value' => Unit::count() ?: '250+', 'label' => 'Managed Units'],
            ['value' => Lease::where('status', 'active')->count() ?: '180+', 'label' => 'Active Tenant Leases'],
            ['value' => PaymentReceipt::count() ?: '1,200+', 'label' => 'Digital Receipts Issued'],
        ];

        // Fetch approved testimonials to display on homepage
        $testimonials = Testimonial::where('is_approved', true)->latest()->get();

        $faqs = [
            [
                'q' => 'What is E-Landlord?',
                'a' => 'E-Landlord is a full-featured digital property management platform built for landlords, with assistant and tenant portals invited by the owner. It digitizes property registration, tenant history, assistant property assignments, receipt generation, and lease renewal reminders.',
            ],
            [
                'q' => 'Who can register on the public website?',
                'a' => 'Only landlords and property owners can create an account from the Register page. You must verify your email before accessing the dashboard. Assistants and tenants are added by a landlord and then sign in — they cannot self-register.',
            ],
            [
                'q' => 'How does property assignment to assistants work?',
                'a' => 'Landlords can create assistant accounts and select specific properties for each assistant to manage. Assistants can only view tenants, issue receipts, and process maintenance for their assigned properties.',
            ],
            [
                'q' => 'How are digital payment receipts generated?',
                'a' => 'When a rent payment is recorded, E-Landlord automatically generates an official digital receipt with a unique reference number (#EL-2026-XXXX). Receipts can be viewed, printed, or saved as PDF at any time by both landlords and tenants.',
            ],
            [
                'q' => 'How do Lease Renewal Alerts work?',
                'a' => 'E-Landlord tracks contract end dates and displays automated 30-day and 60-day warning alerts on the renewal dashboard, enabling 1-click lease extensions.',
            ],
        ];

        return Inertia::render('Home', [
            'stats' => $stats,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
        ]);
    }
}
