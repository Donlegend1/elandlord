<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('interval');
            $table->string('name');
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('description')->nullable();
            $table->json('features')->nullable();
            $table->string('paystack_plan_code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landlord_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->string('paystack_subscription_code')->nullable();
            $table->string('paystack_customer_code')->nullable();
            $table->string('paystack_email_token')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('next_payment_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });

        Schema::create('platform_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subscription_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type');
            $table->string('email');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 8)->default('NGN');
            $table->string('reference')->unique();
            $table->string('status')->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('listing_contact_unlocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('platform_payment_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email');
            $table->timestamp('unlocked_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['property_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listing_contact_unlocks');
        Schema::dropIfExists('platform_payments');
        Schema::dropIfExists('landlord_subscriptions');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('billing_settings');
    }
};
