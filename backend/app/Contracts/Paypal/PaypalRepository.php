<?php

namespace App\Contracts\Paypal;

use App\Contracts\PaymentInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaypalRepository implements PaymentInterface
{

    protected $credential = null;
    public function __construct()
    {
        $this->credential = base64_encode(config("app.paypal_client_id") . ":" . config("app.paypal_secret"));
    }

    public function paymentIntent(Request $request): object
    {
        $credential = $this->credential;
        $otherDetails = $request->details;
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => "Basic {$credential}"
        ])->post('https://api-m.sandbox.paypal.com/v2/checkout/orders', [
            "intent" => "CAPTURE",
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => 'PHP',
                        "value" => $request->amount
                    ]
                ]
            ],
            "payer" => [
                "name" => [
                    'given_name' => $otherDetails['name'],
                    'surname' => ''
                ]
            ],
            "address" => [
                "address_line_1" => $otherDetails['barangay'] . " " . $otherDetails['city'] . " " . $otherDetails['province'],
                "address_line_2" =>  $otherDetails['street'] . " " . $otherDetails['house_no'] . ", " . $otherDetails['zip_code'] . " " . $otherDetails['barangay'],
                "admin_area_1" => "",
                "admin_area_2" => "",
                "postal_code" => $otherDetails['zip_code'],
                "country_code" => "PH",
            ],
            "application_context" => [
                "brand_name" => "TechWatch Payment",
                "shipping_preference" => "NO_SHIPPING",
                "user_action" => "PAY_NOW",
                "return_url" => "http://localhost:3000/payment-done?success=true",
                "cancel_url" => "http://localhost:3000/payment-done?success=false"
            ]

        ]);

        if ($response->serverError() || $response->clientError()) {
            Log::error($response);
            return response()->json([
                'error' => 'Something wrong in Server'
            ], 500);
        }
        return json_decode($response);
    }

    public function capture(object $data): object
    {
        $credential = $this->credential;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$data->approvalId}/capture");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);

        $headers = array();
        $headers[] = 'Content-Type: application/json';
        $headers[] = "Authorization: Basic {$credential}";
        $headers[] = "Paypal-Request-Id: {$data->PayerID}";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        if ($err) {
            return response()->json([
                'message' => 'Something wrong in verify payment',
            ], 500);
        }

        // use the data
        return json_decode($response);
    }
}
