<?php

namespace App\Providers;

use App\Contracts\PaymentInterface;
use App\Contracts\Paypal\PaypalRepository;
use App\Contracts\Stripe\StripeRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // $this->app->bind(PaymentInteraface::class, PaypalRepository::class);

        // Bind the payment gateway based on configuration
        $this->app->bind(PaymentInterface::class, function ($app) {
            $gateway = config('services.payment.default', 'stripe');

            return match($gateway) {
                'stripe' => new StripeRepository(),
                'paypal' => new PayPalRepository(),
                default => new StripeRepository(),
            };
        });

        // Register named instances for direct access
        $this->app->bind('payment.stripe', function ($app) {
            return new StripeRepository();
        });

        // Register named instances for direct access
        $this->app->bind('payment.paypal', function ($app) {
            return new PayPalRepository();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
