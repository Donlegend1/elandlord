<?php

namespace Database\Seeders;

use App\Models\BillingSetting;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        BillingSetting::setValue('free_unit_limit', BillingSetting::getValue('free_unit_limit', 5));
        BillingSetting::setValue('listing_contact_fee', BillingSetting::getValue('listing_contact_fee', 2000));
        BillingSetting::setValue('currency', BillingSetting::getValue('currency', 'NGN'));

        $plans = [
            [
                'interval' => 'monthly',
                'name' => 'Monthly',
                'amount' => 5000,
                'description' => 'Pay month to month. Cancel anytime.',
                'features' => [
                    'Unlimited units while subscribed',
                    'Public listings for every vacant unit',
                    'Priority support',
                ],
                'sort_order' => 1,
            ],
            [
                'interval' => 'quarterly',
                'name' => 'Quarterly',
                'amount' => 13500,
                'description' => 'Billed every 3 months. Save versus monthly.',
                'features' => [
                    'Unlimited units while subscribed',
                    'Public listings for every vacant unit',
                    'Two months at a discount',
                ],
                'sort_order' => 2,
            ],
            [
                'interval' => 'annually',
                'name' => 'Yearly',
                'amount' => 48000,
                'description' => 'Best value. One payment for 12 months.',
                'features' => [
                    'Unlimited units while subscribed',
                    'Public listings for every vacant unit',
                    'Lowest monthly cost',
                ],
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::query()->firstOrCreate(
                ['interval' => $plan['interval']],
                $plan,
            );
        }
    }
}
