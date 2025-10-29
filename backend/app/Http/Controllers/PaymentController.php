<?php

namespace App\Http\Controllers;

use App\Contracts\PaymentInterface;
use App\Models\Order;
use App\Traits\SendingEmail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    use SendingEmail;

    private $payment;
    private $order;

    public function __construct(PaymentInterface $paymentInterface, Order $order)
    {
        $this->payment = $paymentInterface;
        $this->order = $order;
    }

    public function stripePost(Request $request)
    {

        try {
            $payment = $this->payment;
            $responsePaymentIntent = $payment->paymentIntent($request);
            $responsePaymentCapture = $payment->capture($responsePaymentIntent);
            if ($responsePaymentCapture->status == "succeeded") {
                $order = DB::transaction(function () use ($request, $responsePaymentIntent) {
                    $order = Order::create([
                        'user_id' => $request->user()->id,
                        'amount' => $request->amount,
                        'qty' => $request->totatQty,
                        'payment_type' => $request->payment,
                        'approval_id' => $responsePaymentIntent->id
                    ]);
                    $order->orderItem()->create([
                        'items' => json_encode($request->items),
                        'details' => json_encode($request->details)
                    ]);
                    return $order->refresh();
                });

                return response()->json([
                    'approvalId' => $responsePaymentIntent->id,
                    'order_id' => $order->id,
                ], 200);
            } else {
                return response()->json([
                    'error' => 'The card payment encounter something wrong'
                ], 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'The card payment encounter something wrong',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function stripeCapture(Request $request)
    {
        try {

            $orderUpdate = $this->order->findorFail($request->order_id);

            if (!$orderUpdate) {
                return response()->json([
                    'error' => 'The order id was invalid. please dont manipulate the order id in domain query'
                ], 400);
            }

            if (!$orderUpdate->status) {
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
        try {
            $orderLinks = null;
            $payment = app('payment.paypal');
            $response = $payment->paymentIntent($request);

            foreach ($response->links as $link) {
                if ($link->rel === "approve") {
                    $orderLinks = $link->href;
                }
            }

            if (!$orderLinks) {
                return response()->json([
                    'error' => 'paypal payment unavailable/error.'
                ], 400);
            }

            $order = DB::transaction(function () use ($request, $response) {
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'amount' => $request->amount,
                    'qty' => $request->totatQty,
                    'payment_type' => $request->payment,
                    'approval_id' => $response->id
                ]);

                $order->orderItem()->create([
                    'items' => json_encode($request->items),
                    'details' => json_encode($request->details)
                ]);

                return $order->refresh();
            });

            $data = [
                'data' => json_encode($response),
                'links' => $orderLinks,
                'approvalId' => $response->id,
                'order_id' => $order->id,
            ];
            return response()->json($data, 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'paypal payment encounter error', 'message' => $e->getMessage()], 500);
        }
    }

    public function cancelOrderPayment(Request $request)
    {
        try {
            $order = $this->order->find($request->orderId);

            if ($order) {
                $order->delete();
                return response()->json([
                    'message' => 'Cancel order payment Success',
                ], 200);
            }
            $user = request()->user();

            $user->orders()->where('status', false)->delete();

            return response()->json([
                'message' => 'Cancel order payment Success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in verify Cancel Payment',
                $e->getMessage()
            ], 500);
        }
    }

    public function fetchOrder(Request $request)
    {
        try {
            $order = $this->order->with('orderItem')->where([
                ['id', '=', $request->order_id],
                ['approval_id', '=', $request->paymentId],
                ['payer_id', '=', $request->payerId],
                // ['user_id', '=', request()->user()->id]
            ])
                // ->where('user_id', request()->user()->id)
                ->first();

            if (!$order) {
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
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server',
            ], 500);
        }
    }

    public function capture(Request $request)
    {

        try {
            $payment = app('payment.paypal');
            // check approval id if exist and not pay already and its name in user
            if (!$request->approvalId && $request->PayerID) {
                return response()->json([
                    'message' => 'Something wrong in approvalId and PayerID'
                ], 500);
            }

            $response = $payment->capture($request);
            // put in seperate function
            $orderUpdate = $this->order->find($request->order_id);
            $orderUpdate->status = true;
            $orderUpdate->order_status = 'verified';
            $orderUpdate->payer_id = $request->PayerID;
            $orderUpdate->token = $request->token;
            $orderUpdate->save();
            $orderUpdate->load('orderItem');
            // include this 2 return
            $data = [
                'order' => $orderUpdate,
                'items' => $orderUpdate->orderItem()
            ];
            $this->sendEmail("verify", $orderUpdate->orderItem->details->email, $data);

            return response()->json([
                'response' => $response,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in verify payment',
                $e->getMessage()
            ], 500);
        }
    }
}
