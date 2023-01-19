<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{

    public function index(Request $request)
    {
        try {
            // $products = Product::all();

            // $products = DB::table('products');
            // if($request->has('filter') && $request->query('filter') != "all") {
            //     $products->where('categories', $request->query('filter'));
            // }
            // $products = $products->get();

            $products = Product::when($request->has('filter') && $request->query('filter') != "all", function($query) use ($request) {
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
