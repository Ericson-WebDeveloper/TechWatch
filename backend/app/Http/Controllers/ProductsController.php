<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{

    protected Product $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function index(Request $request)
    {
        try {
            $products = $this->product->when($request->has('filter') && $request->query('filter') != "all", function ($query) use ($request) {
                return $query->where('categories', $request->query('filter'));
            })->get();
            return response()->json([
                'products' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
