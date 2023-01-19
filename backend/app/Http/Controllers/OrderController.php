<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::with('orderItem')->where('user_id', request()->user()->id)->get();

        return response()->json([
            'data' => $orders,
            'message' => 'Order Fecth'
        ], 200);
    }

    public function show($id)
    {
        $orderItem = OrderItem::with('order')->where([
            ['id', '=', $id],
        ])->first();

        return response()->json([
            'data' => $orderItem,
            'message' => 'Order Item Fecth'
        ], 200);
    }

    public function getOrder($id)
    {
        try {
            $order = Order::where([
                ['id', '=', $id],
            ])->first();

            return response()->json([
                'data' => $order,
                'message' => 'Order Fetch'
            ], 200);
        }catch (Exception $e) {
            return response()->json([
                'error' => 'Order Fetch Failed'
            ], 500);
        }

    }


    public function summary(Request $request)
    {
        $orders = Order::where('user_id', request()->user()->id)->get();

        return response()->json([
            'data' => [
                'total' => $orders->count(),
                'toPack' => $orders->where('order_status', '==', 'verified')->count(),
                'toShipped' => $orders->where('order_status', '==', 'shipped')->count(),
                'Delivered' => $orders->where('order_status', '==', 'delivered')->count(),
            ],
            'message' => 'Order Fetch Summary'
        ], 200);
    }

}
