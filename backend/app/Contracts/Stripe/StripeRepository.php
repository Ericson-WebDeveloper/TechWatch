<?php

namespace App\Contracts\Stripe;

use App\Contracts\PaymentInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripeRepository implements PaymentInterface
{

    protected $credential = null;

    public function __construct()
    {
        $this->credential = config("app.stripe_secret");
    }
    public function paymentIntent(Request $request) : object
    {
        $credential = $this->credential;
        $ch = curl_init();
        $array = [
            "amount" => $request->amount * 100,
            "currency" => "usd",
            // "currency" => "php",
            "payment_method" => $request->stripeToken,
            "confirmation_method" => "manual"
        ];

        curl_setopt($ch, CURLOPT_URL, 'https://api.stripe.com/v1/payment_intents');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($array));

        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        $headers[] = "Authorization: Bearer {$credential}";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        curl_close($ch);
        return json_decode($result);
    }

    public function capture(object $data): object {
        $credential = $this->credential;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://api.stripe.com/v1/payment_intents/{$data->id}/confirm");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_POST, 1);

        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        $headers[] = "Authorization: Bearer {$credential}";
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $result2 = curl_exec($curl);
        curl_close($curl);

        return json_decode($result2);
    }
}
