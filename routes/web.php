<?php

use App\Http\Controllers\Admin\BillingController as AdminBillingController;
use App\Http\Controllers\Admin\LegalPageController as AdminLegalPageController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalPageController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ListingSettingsController;
use App\Http\Controllers\ListingUnlockController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PaystackWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\RenewalReminderController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public client / visitor pages
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/faq', fn () => Inertia::render('FAQ'))->name('faq');
Route::get('/terms', [LegalPageController::class, 'terms'])->name('terms');
Route::get('/privacy', [LegalPageController::class, 'privacy'])->name('privacy');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/listings', [ListingController::class, 'index'])->name('listings.index');
Route::get('/listings/{property}', [ListingController::class, 'show'])->name('listings.show');
Route::post('/listings/{property}/inquire', [ListingController::class, 'inquire'])
    ->middleware('throttle:5,1')
    ->name('listings.inquire');
Route::post('/listings/{property}/unlock', [ListingUnlockController::class, 'store'])
    ->middleware('throttle:8,1')
    ->name('listings.unlock');
Route::get('/listings/{property}/unlock/callback', [ListingUnlockController::class, 'callback'])
    ->name('listings.unlock.callback');
Route::post('/paystack/webhook', PaystackWebhookController::class)->name('paystack.webhook');
Route::get('/locations/states', [LocationController::class, 'states'])->name('locations.states');
Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/settings/listing', [ListingSettingsController::class, 'edit'])->name('settings.listing');
    Route::patch('/settings/listing', [ListingSettingsController::class, 'update'])->name('settings.listing.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Properties Management
    Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::put('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    Route::post('/properties/{property}/assign-assistant', [PropertyController::class, 'assignAssistant'])->name('properties.assign-assistant');

    // Tenants Management & History
    Route::get('/tenants', [TenantController::class, 'index'])->name('tenants.index');
    Route::get('/tenants/create', [TenantController::class, 'create'])->name('tenants.create');
    Route::get('/tenants/lookup', [TenantController::class, 'lookup'])->name('tenants.lookup');
    Route::post('/tenants', [TenantController::class, 'store'])->name('tenants.store');
    Route::get('/tenants/{tenant}', [TenantController::class, 'show'])->name('tenants.show');
    Route::get('/tenants/{tenant}/identification', [TenantController::class, 'identification'])->name('tenants.identification');
    Route::delete('/tenants/{tenant}', [TenantController::class, 'destroy'])->name('tenants.destroy');
    Route::delete('/leases/{lease}', [TenantController::class, 'removeLease'])->name('leases.destroy');

    // Assistant Management (Landlord only)
    Route::get('/assistants', [AssistantController::class, 'index'])->name('assistants.index');
    Route::post('/assistants', [AssistantController::class, 'store'])->name('assistants.store');
    Route::post('/assistants/{assistant}/assign-properties', [AssistantController::class, 'assignProperties'])->name('assistants.assign-properties');

    // Payment Receipts
    Route::get('/receipts', [ReceiptController::class, 'index'])->name('receipts.index');
    Route::post('/receipts', [ReceiptController::class, 'store'])->name('receipts.store');
    Route::get('/receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show');

    // Renewal Reminders
    Route::get('/renewals', [RenewalReminderController::class, 'index'])->name('renewals.index');
    Route::post('/renewals/{lease}/renew', [RenewalReminderController::class, 'renewLease'])->name('renewals.renew');

    // Maintenance Requests
    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::post('/maintenance', [MaintenanceController::class, 'store'])->name('maintenance.store');
    Route::patch('/maintenance/{maintenanceRequest}/status', [MaintenanceController::class, 'updateStatus'])->name('maintenance.update-status');

    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::get('/billing/callback', [BillingController::class, 'callback'])->name('billing.callback');

    Route::middleware('role:super_admin')->group(function () {
        Route::get('/legal-pages', [AdminLegalPageController::class, 'index'])->name('legal-pages.index');
        Route::get('/legal-pages/{legalPage}/edit', [AdminLegalPageController::class, 'edit'])->name('legal-pages.edit');
        Route::put('/legal-pages/{legalPage}', [AdminLegalPageController::class, 'update'])->name('legal-pages.update');
        Route::get('/billing/settings', [AdminBillingController::class, 'index'])->name('billing.settings');
        Route::put('/billing/settings', [AdminBillingController::class, 'updateSettings'])->name('billing.settings.update');
    });
});

require __DIR__.'/auth.php';
