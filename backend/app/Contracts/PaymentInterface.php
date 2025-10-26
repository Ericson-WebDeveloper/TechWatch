<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface PaymentInterface {
    public function paymentIntent(Request $request) : object;
    public function capture(object $data): object;
}