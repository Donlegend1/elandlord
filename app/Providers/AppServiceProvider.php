<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // If public_html exists as a sibling directory (common in shared hosting) and we are not in local development,
        // register it as the public path so Laravel resources/Vite load correctly.
        if (!app()->environment('local')) {
            $publicHtml = realpath(base_path('../public_html'));
            if ($publicHtml) {
                $this->app->usePublicPath($publicHtml);
            }
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Registered::class, SendEmailVerificationNotification::class);

        Vite::prefetch(concurrency: 3);
    }
}
