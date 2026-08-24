<?php

namespace App\Services;

use App\Models\BillingSetting;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class PaystackService
{
    public static function configured(): bool
    {
        return filled(config('paystack.secret_key'));
    }

    public function ensureConfigured(): void
    {
        if (! static::configured()) {
            throw new RuntimeException('Paystack is not configured. Add PAYSTACK_SECRET_KEY to your environment.');
        }
    }

    public function toSubunit(float|int|string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }

    public function fromSubunit(int $amount): float
    {
        return round($amount / 100, 2);
    }

    public function syncPlan(SubscriptionPlan $plan): SubscriptionPlan
    {
        $this->ensureConfigured();

        $payload = [
            'name' => $plan->name,
            'interval' => $plan->paystackInterval(),
            'amount' => $this->toSubunit($plan->amount),
            'currency' => BillingSetting::currency(),
            'description' => $plan->description,
        ];

        if ($plan->paystack_plan_code) {
            $response = $this->request('put', '/plan/'.$plan->paystack_plan_code, $payload + [
                'update_existing_subscriptions' => false,
            ]);
        } else {
            $response = $this->request('post', '/plan', $payload);
            $plan->paystack_plan_code = $response['data']['plan_code'] ?? null;
            $plan->save();
        }

        return $plan->refresh();
    }

    public function initialize(array $payload): array
    {
        $this->ensureConfigured();

        $payload['currency'] = $payload['currency'] ?? BillingSetting::currency();
        $payload['reference'] = $payload['reference'] ?? 'EL-'.Str::upper(Str::random(18));

        $response = $this->request('post', '/transaction/initialize', $payload);

        return $response['data'];
    }

    public function verify(string $reference): array
    {
        $this->ensureConfigured();

        $response = $this->request('get', '/transaction/verify/'.$reference);

        return $response['data'];
    }

    protected function request(string $method, string $path, array $payload = []): array
    {
        $http = Http::withToken(config('paystack.secret_key'))
            ->acceptJson()
            ->asJson()
            ->timeout(30)
            ->baseUrl(rtrim(config('paystack.base_url'), '/'));

        $response = $method === 'get'
            ? $http->get($path)
            : $http->{$method}($path, $payload);

        try {
            $response->throw();
        } catch (RequestException $e) {
            $message = $response->json('message') ?: $e->getMessage();
            throw new RuntimeException('Paystack error: '.$message, previous: $e);
        }

        $json = $response->json();

        if (! ($json['status'] ?? false)) {
            throw new RuntimeException('Paystack error: '.($json['message'] ?? 'Unknown error'));
        }

        return $json;
    }
}
