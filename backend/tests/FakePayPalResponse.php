<?php

namespace Tests;

use App\Models\User;

class FakePayPalResponse
{
    public $id;
    public $intent;
    public $status;
    public $payer;
    public $purchase_units;
    public $links;

    public function __construct(User $user)
    {
        $this->id = '4CJ55906L11395406';
        $this->intent = 'CAPTURE';
        $this->status = 'CREATED';

        $this->payer = (object) [
            'name' => (object) [
                'given_name' => $user->name,
                'surname' => '',
            ],
            'email_address' => $user->email,
            'payer_id' => 'ABCD12345XYZ',
        ];

        $this->purchase_units = [
            (object) [
                'reference_id' => 'default',
                'amount' => (object) [
                    'currency_code' => 'USD',
                    'value' => '100.00',
                ],
                'description' => 'Order Payment for TechWatch',
            ],
        ];

        $this->links = [
            (object) [
                'href' => 'https://api.sandbox.paypal.com/v2/checkout/orders/4CJ55906L11395406',
                'rel' => 'self',
                'method' => 'GET',
            ],
            (object) [
                'href' => 'https://www.sandbox.paypal.com/checkoutnow?token=4CJ55906L11395406',
                'rel' => 'approve',
                'method' => 'GET',
            ],
            (object) [
                'href' => 'https://api.sandbox.paypal.com/v2/checkout/orders/4CJ55906L11395406/capture',
                'rel' => 'capture',
                'method' => 'POST',
            ],
        ];
    }
}
