<?php

namespace Tests;

use App\Models\Order;
use App\Models\User;

class FakePaypalCaptureResponse
{
    public $approvalId;
    public $PayerID;
    public $responseBody;

    public function __construct(User $user, Order $order)
    {
        $this->approvalId = $order->approval_id; // order ID
        $this->PayerID = $order->payer_id;         // payer ID

        // Simulate JSON response returned from PayPal API
        $this->responseBody = json_encode([
            'id' => $this->approvalId,
            'status' => 'COMPLETED',
            'payer' => [
                'payer_id' => $this->PayerID,
                'email_address' => $user->email,
                'name' => [
                    'given_name' => $user->name,
                    'surname' => '',
                ],
            ],
            'purchase_units' => [
                [
                    'reference_id' => 'default',
                    'payments' => [
                        'captures' => [
                            [
                                'id' => '9XY12345ZC678901',
                                'status' => 'COMPLETED',
                                'amount' => [
                                    'currency_code' => 'USD',
                                    'value' => '100.00',
                                ],
                                'final_capture' => true,
                            ],
                        ],
                    ],
                ],
            ],
            'links' => [
                [
                    'rel' => 'self',
                    'href' => "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$this->approvalId}",
                    'method' => 'GET',
                ],
            ],
        ]);
    }
}
