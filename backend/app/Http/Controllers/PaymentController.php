<?php

namespace App\Http\Controllers;

use App\Mail\OrderNotification;
use App\Models\Order;
use App\Traits\SendingEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe;
use Stripe\Exception\CardException;

class PaymentController extends Controller
{
    use SendingEmail;

    public $credentials;

    public function __construct()
    {
        $this->credentials = base64_encode("AYmeSXIfoqQtcI5BcS_onBV19S3SXajWVlGRV32fe-r6adQlRse_MN_f2oWiFwxHmj29H5iQtB50L6IN:EHEnePOMSTBYo3iYcd1fOTxXcE_LrkxQRMWL9AttKgOdrsUAWpSTRvUMtHsrFbhDqa6TFHr8WTqWyXEh");
    }

    public function stripePost(Request $request)
    {
        try{

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
            $headers[] = "Authorization: Bearer sk_test_51H0dohKWzaP0y47nwJHdOzaVFfh0vQXjuKTT8izINS5GvuoUT1jNcM0WD5fvLn1bNOEhurk39Wfyq6rkmkXpWiuO00sWCHCqkB";
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $result = curl_exec($ch);
            curl_close($ch);
            $newresult = json_decode($result);
            $payment_intents_id = $newresult->id;



            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://api.stripe.com/v1/payment_intents/{$payment_intents_id}/confirm");
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_POST, 1);

            $headers = array();
            $headers[] = 'Content-Type: application/x-www-form-urlencoded';
            $headers[] = "Authorization: Bearer sk_test_51H0dohKWzaP0y47nwJHdOzaVFfh0vQXjuKTT8izINS5GvuoUT1jNcM0WD5fvLn1bNOEhurk39Wfyq6rkmkXpWiuO00sWCHCqkB";
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            $result2 = curl_exec($curl);
            curl_close($curl);

            $response = json_decode($result2);

            // the card credentials has not need authentication process confirmation
            if($response->status == "succeeded") {
                 // $orderId = (string) Str::uuid();
                // store Order and Order_Item
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'amount' => $request->amount,
                    'qty' => $request->totatQty,
                    'payment_type' => $request->payment,
                    'approval_id' => $payment_intents_id
                ]); // status need to pay, cancel or Error

                $order->orderItem()->create([
                    'items' => json_encode($request->items),
                    'details' => json_encode($request->details)
                ]);

                return response()->json([
                    'approvalId' => $payment_intents_id,
                    'order_id' => $order->id,
                ], 200);

            }

        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'The card payment encounter something wrong'
            ], 400);

        }

    }

    public function stripeCapture(Request $request)
    {
        try{

            $orderUpdate = Order::findorFail($request->order_id);

            if(!$orderUpdate) {
                return response()->json([
                    'error' => 'The order id was invalid. please dont manipulate the order id in domain query'
                ], 400);
            }

            if(!$orderUpdate->status) {
                $orderUpdate->status = true;
                $orderUpdate->order_status = 'verified';
                $orderUpdate->payer_id = $request->has('PayerID') ? $request->PayerID : null;
                $orderUpdate->token = $request->has('token') ? $request->token : null;
                $orderUpdate->save();
            }


            // include this 2 return
            $data = [
                'order' => $orderUpdate,
                'items' => $orderUpdate->orderItem()
            ];

            // Mail::to($orderUpdate->orderItem->details->email)->send(new OrderNotification($data, "verify"));
            $this->sendEmail("verify", $orderUpdate->orderItem->details->email, $data);

            return response()->json([
                'approvalId' => $orderUpdate->approval_id,
                'order_id' => $orderUpdate->id,
            ], 200);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Something wrong in Server. please Contact us for Error encounter.'
            ], 500);
        }

    }


    public function payment(Request $request)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => "Basic {$this->credentials}"
        ])->post('https://api-m.sandbox.paypal.com/v2/checkout/orders', [
            "intent" => "CAPTURE",
            "purchase_units" => [
                0 => [
                    "amount" => [
                        // "currency_code" => 'USD',
                        "currency_code" => 'PHP',
                        "value" => $request->amount
                        ]
                    ]
            ],
            "payer" => [
                "name" => [
                    'given_name' => 'Nancy Eric',
                    'surname' => 'Tester'
                ]
            ],
            "address" => [
                "address_line_1" => "Cavite",
                "address_line_2" => "Naic",
                "admin_area_1" => "",
                "admin_area_2" => "",
                "postal_code" => "4110",
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

        if($response->serverError() || $response->clientError()) {
            return response()->json([
                'error' => 'Something wrong in Server'
            ], 500);
        }
        $res = json_decode($response);

        // $orderLinks;

        
        // search the links object with rel = 'approve' and use the href links
        foreach($res->links as $link) {
          
            if($link->rel === "approve") {
                $orderLinks = $link->href;
            }
        }
    
        // store Order and Order_Item
        $order = Order::create([
            // 'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'amount' => $request->amount,
            'qty' => $request->totatQty,
            'payment_type' => $request->payment,
            'approval_id' => $res->id
        ]); // status need to pay, cancel or Error

        $order->orderItem()->create([
            'items' => json_encode($request->items),
            'details' => json_encode($request->details)
        ]);

        return response()->json([
            'data' => $response->json(),
            'links' => $orderLinks,
            'approvalId' => $res->id,
            'order_id' => $order->id,
        ], 200);
    }

    public function cancelOrderPayment(Request $request)
    {
        try {
            $order = Order::find($request->orderId);

            if ($order) {
                $order->delete();
                return response()->json([
                    'message' => 'Cancel order payment Success',
                ], 200);
            }
            $user = request()->user();

            $user->orders()->where('status', false)->get()->delete();

            return response()->json([
                'message' => 'Cancel order payment Success',
            ], 200);

        } catch(\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in verify Cancel Payment',
            ], 500);
        }
    }

    public function fetchOrder(Request $request)
    {
        try {
            $order = Order::with('orderItem')->where([
                ['id', '=', $request->order_id],
                ['approval_id', '=', $request->paymentId],
                ['payer_id', '=', $request->payerId],
                // ['user_id', '=', request()->user()->id]
            ])
            // ->where('user_id', request()->user()->id)
            ->first();

            if(!$order) {
                return response()->json([
                    'error' => 'The order id was invalid. please dont manipulate the order id in domain query',
                ], 400);
            }

            return response()->json([
                'message' => 'Fetching Order Details',
                'data' => [
                    'order' => $order
                ]
            ], 200);

        } catch(\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server',
            ], 500);
        }

    }

    public function capture(Request $request)
    {
        try{
            // check approval id if exist and not pay already and its name in user

            if(!$request->approvalId && $request->PayerID) {
                return response()->json([
                    'message' => 'Something wrong in approvalId and PayerID'
                ], 500);
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$request->approvalId}/capture");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);

            $headers = array();
            $headers[] = 'Content-Type: application/json';
            $headers[] = "Authorization: Basic {$this->credentials}";
            $headers[] = "Paypal-Request-Id: {$request->PayerID}";
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
            $res = json_decode($response);
            // put in seperate function
            $orderUpdate = Order::find($request->order_id);
            $orderUpdate->status = true;
            $orderUpdate->order_status = 'verified';
            $orderUpdate->payer_id = $request->PayerID;
            $orderUpdate->token = $request->token;
            $orderUpdate->save();
            // include this 2 return
            $data = [
                'order' => $orderUpdate,
                'items' => $orderUpdate->orderItem()
            ];
            $this->sendEmail("verify", $orderUpdate->orderItem->details->email, $data);

            return response()->json([
                'response' => $res,
            ], 200);

        }catch(\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in verify payment',
                $e->getMessage()
            ], 500);
        }

    }

}
