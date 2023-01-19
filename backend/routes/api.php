<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function() {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/user/logout', function (Request $request) {
        try{
            $request->user()->tokens()->delete();

            return response()->json([
                'message' => 'Logout Success'
            ], 200);

        }catch(Exception $e) {
            return response()->json([
                'message' => 'Logout Failed'
            ], 500);
        }
    });

    Route::get('/user/orders', [OrderController::class, 'index']);
    Route::get('/user/order/item/{id}', [OrderController::class, 'show']);
    Route::get('/user/order/track-package/{id}', [OrderController::class, 'getOrder']);
    Route::get('/user/orders/summary', [OrderController::class, 'summary']);

    Route::post('/user/profile-update', [UserController::class, 'updateProfile']);
    Route::post('/user/password-update', [UserController::class, 'updatePassword']);
    Route::post('/user/billing-address/update', [UserController::class, 'updateBilling']);
    Route::get('/user/billing-address', [UserController::class, 'getBilling']);



    Route::post('/payment-paypal', [PaymentController::class, 'payment']);
    Route::post('/payment-paypal/capture', [PaymentController::class, 'capture']);
    Route::post('/payment-paypal/cancel/order', [PaymentController::class, 'cancelOrderPayment']);
    Route::post('/payment-paypal/fetch', [PaymentController::class, 'fetchOrder']);

    Route::post('/payment-card', [PaymentController::class, 'stripePost']);
    Route::post('/payment-card/capture', [PaymentController::class, 'stripeCapture']);
});

// Route::middleware(['auth', 'second'])->group(function () {

// });

Route::get('/category', [CategoryController::class, 'index']);
Route::get('/products', [ProductsController::class, 'index']);
Route::post('/user/register', [AuthController::class, 'register']);
Route::post('/user/login', [AuthController::class, 'login']);

Route::post('/user/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/user/reset-password', [UserController::class, 'resettingPassword']);


Route::post('/user/{provider}/login', [AuthController::class, 'login_social_account']);
Route::post('/user/login/social/callback', [AuthController::class, 'login_social_callback']);
