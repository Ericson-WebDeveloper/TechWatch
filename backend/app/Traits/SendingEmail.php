<?php

namespace App\Traits;

use App\Mail\OrderNotification;
use Illuminate\Support\Facades\Mail;

trait SendingEmail {

    public function sendEmail($type, $to, $data)
    {
        return Mail::to($to)->send(new OrderNotification($data, $type));
    }
}
