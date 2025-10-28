<?php

namespace Tests\Feature\Api;

use App\Contracts\PaymentInterface;
use App\Mail\OrderNotification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use PhpParser\Node\Expr\Throw_;
use Tests\FakePaypalCaptureResponse;
use Tests\FakePayPalResponse;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;
    private $faker;

    public function setup(): void
    {
        parent::setUp();
        $this->faker = \Faker\Factory::create();
        $this->seed(ProductSeeder::class);
    }

    protected function tearDown(): void
    {
        Mockery::close(); // this removes lingering mocks
        parent::tearDown();
    }

    /**
     * A basic feature test example.
     *
     * @return void
     * 
     * 
     * stripePost
     * 
     */
    public function test_stripe_payment_failed_400()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $data = [
            'amount' => $order->amount,
            'totatQty' => $order->qty,
            'payment' => 'card',
            'items' => $orderItem,
            'details' => $billing,
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn((object)['id' => '142424']);
        $paymentMock->shouldReceive('capture')->with(Mockery::type(\stdClass::class))->andReturn((object)['id' => '1424243', 'status' => 'failed']);
        $this->app->instance(PaymentInterface::class, $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-card', $data);
        $response->assertStatus(400)->assertJsonStructure(['error'])->assertJson(['error' => 'The card payment encounter something wrong']);
    }

    public function test_stripe_payment_intent_failed_throw_exception()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $data = [
            'amount' => $order->amount,
            'totatQty' => $order->qty,
            'payment' => 'card',
            'items' => $orderItem,
            'details' => $billing,
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andThrow(new \Exception('Card Payment Unavailable'));
        $this->app->instance(PaymentInterface::class, $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-card', $data);
        $response->assertStatus(500)->assertJsonStructure(['error'])
            ->assertJson(['error' => 'The card payment encounter something wrong', 'message' => 'Card Payment Unavailable']);
    }

    public function test_stripe_payment_capture_failed_throw_exception()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $data = [
            'amount' => $order->amount,
            'totatQty' => $order->qty,
            'payment' => 'card',
            'items' => $orderItem,
            'details' => $billing,
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn((object)['id' => '142424']);
        $paymentMock->shouldReceive('capture')->with(Mockery::type(\stdClass::class))->andThrow(new \Exception('Card Payment Confirm Error'));
        $this->app->instance(PaymentInterface::class, $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-card', $data);
        $response->assertStatus(500)->assertJsonStructure(['error', 'message'])
            ->assertJson([
                'error' => 'The card payment encounter something wrong',
                'message' => 'Card Payment Confirm Error'
            ]);
    }

    public function test_stripe_payment_success()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' => $billing,
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn((object)['id' => '142424']);
        $paymentMock->shouldReceive('capture')->with(Mockery::type(\stdClass::class))->andReturn((object)['id' => '1424243', 'status' => 'succeeded']);
        $this->app->instance(PaymentInterface::class, $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-card', $data);
        $response->assertStatus(200)
            ->assertJsonStructure(['approvalId', 'order_id'])
            ->assertJson(['approvalId' => '142424']);
    }

    public function test_stripe_payment_failed_db_throw_exception()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' => $billing,
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn((object)['id' => '142424']);
        $paymentMock->shouldReceive('capture')->with(Mockery::type(\stdClass::class))->andReturn((object)['id' => '1424243', 'status' => 'succeeded']);
        $this->app->instance(PaymentInterface::class, $paymentMock);

        DB::shouldReceive('transaction')
            ->once()
            ->with(Mockery::type(\Closure::class))
            ->andThrow(new \Exception('Error Creation of Order'));
        DB::shouldReceive('rollBack')->once();

        $response = $this->actingAs($user)->postJson('/api/payment-card', $data);
        $response->assertStatus(500)->assertJsonStructure(['error', 'message'])
            ->assertJson([
                'error' => 'The card payment encounter something wrong',
                'message' => 'Error Creation of Order'
            ]);
    }


    /***
     * 
     * stripeCapture
     * 
     */

    public function test_stripe_capture_find_fail()
    {
        $user = $this->createUserFactory();
        $data = [
            'order_id' => 6,
            'PayerID' => null,
            'token' => null
        ];
        $response = $this->actingAs($user)->postJson('/api/payment-card/capture', $data);

        $response->assertStatus(500)->assertJson(['error' => 'Something wrong in Server. please Contact us for Error encounter.'])->assertJsonStructure(['error']);
    }

    public function test_stripe_capture_success()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'token' => $order->token
        ];
        $response = $this->actingAs($user)->postJson('/api/payment-card/capture', $data);
        Mail::assertSent(OrderNotification::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
        $response->assertStatus(200)->assertJsonStructure(['approvalId', 'order_id'])->assertJson([
            "approvalId" => $order->approval_id,
            "order_id" => $order->id
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payer_id' => $order->payer_id,
            'token' => $order->token,
            'status' => 1,
            'order_status' => 'verified'
        ]);
    }

    public function test_stripe_capture_success_but_no_update()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => true, 'order_status' => 'shipped']
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'token' => $order->token
        ];
        $response = $this->actingAs($user)->postJson('/api/payment-card/capture', $data);
        Mail::assertSent(OrderNotification::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
        $response->assertStatus(200)->assertJsonStructure(['approvalId', 'order_id'])->assertJson([
            "approvalId" => $order->approval_id,
            "order_id" => $order->id
        ]);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payer_id' => $order->payer_id,
            'token' => $order->token,
            'status' => 1,
            'order_status' => $order->order_status
        ]);
    }

    public function test_stripe_capture_mail_throw_exception()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => true, 'order_status' => 'shipped']
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'token' => $order->token
        ];
        Mail::shouldReceive('to->send')
            ->once()
            ->andThrow(new \Exception('Mail send failed'));
        $response = $this->actingAs($user)->postJson('/api/payment-card/capture', $data);

        $response->assertStatus(500);
    }

    public function test_stripe_capture_update_order_throw_exception()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => 0]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'token' => $order->token
        ];
        $orderMock = Mockery::mock(Order::class)->makePartial();
        $orderMock->shouldReceive('findorFail')->with($order->id)->andReturnSelf();
        $orderMock->shouldReceive('save')->andThrow(new \Exception('Error Order Confirm'));
        $this->app->instance(Order::class, $orderMock);

        $response = $this->actingAs($user)->postJson('/api/payment-card/capture', $data);
        $response->assertStatus(500);
    }

    /***
     * 
     * 
     * payment
     * 
     * 
     */

    public function test_payment_paypal_failed_throw_exception()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' => $billing,
        ];
        // config(['services.payment.default' => 'paypal']);
        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn(response()->json(['error' => 'Something wrong in Server'], 500));
        $this->app->instance('payment.paypal', $paymentMock);

        DB::shouldReceive('rollBack')->once();

        $response = $this->actingAs($user)->postJson('/api/payment-paypal', $data);
        $response->assertStatus(500);
    }


    public function test_payment_paypal_response_link_null()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' =>  array_merge($billing->toArray(), [
                'name' => $user->name,
                'email' => $user->email,
            ])
        ];
        // config(['services.payment.default' => 'paypal']);
        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->links = [];
        $paymentMock->shouldReceive('paymentIntent')->with(Mockery::type(Request::class))->andReturn(
            new class {
                public $id = 'fake-id';
                public $links = []; // empty links to trigger error
            }
        );
        $this->app->instance('payment.paypal', $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal', $data);
        $response->assertStatus(400)->assertJsonStructure(['error'])->assertJson(['error' => 'paypal payment unavailable/error.']);
    }

    public function test_payment_paypal_db_transaction_failed()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' =>  array_merge($billing->toArray(), [
                'name' => $user->name,
                'email' => $user->email,
            ])
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePayPalResponse($user));
        $this->app->instance('payment.paypal', $paymentMock);

        DB::shouldReceive('transaction')->with(Mockery::type(\Closure::class))->once()
            ->andThrow(new \Exception('Completing Order Failed'));
        DB::shouldReceive('rollback')->once();
        $response = $this->actingAs($user)->postJson('/api/payment-paypal', $data);

        $response->assertStatus(500)->assertJson([
            'error' => 'paypal payment encounter error',
            'message' => 'Completing Order Failed'
        ]);
    }

    public function test_payment_paypal_success()
    {
        $user = $this->createUserFactory();
        $billing = $this->createBillingAddressFactory($user->id);
        $products = Product::first();
        $data = [
            'amount' => 1000,
            'totatQty' => 3,
            'payment' => 'card',
            'items' => [
                'name' => $products->name,
                'price' => $products->price,
                'totalprice' => $products->price * 2,
                'img' => $products->img,
                'qty' => 2
            ],
            'details' =>  array_merge($billing->toArray(), [
                'name' => $user->name,
                'email' => $user->email,
            ])
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePayPalResponse($user));
        $this->app->instance('payment.paypal', $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal', $data);

        $response->assertStatus(200)->assertJsonStructure([
            'data',
            'links',
            'approvalId',
            'order_id'
        ]);
    }

    /***
     * 
     * 
     * capture
     * 
     * 
     */
    public function test_paypal_payment_capture_success()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'approvalId' => $order->approval_id,
            'token' => $order->token
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('capture')
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePaypalCaptureResponse($user, $order));
        $this->app->instance('payment.paypal', $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/capture', $data);
        Mail::assertSent(OrderNotification::class);
        $response->assertStatus(200)->assertJsonStructure([
            'response'
        ])
            ->assertJson(['response' => (array)new FakePaypalCaptureResponse($user, $order)]);
    }

    public function test_paypal_payment_capture_throw_exception()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'approvalId' => $order->approval_id,
            'token' => $order->token
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('capture')
            ->with(Mockery::type(Request::class))
            ->andThrow(new \Exception('Something wrong in verify paypal payment'));
        $this->app->instance('payment.paypal', $paymentMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/capture', $data);

        $response->assertStatus(500)->assertJson(['error' => 'Something wrong in verify payment', 'Something wrong in verify paypal payment']);
    }

    public function test_paypal_payment_capture_update_order_throw_exception()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'approvalId' => $order->approval_id,
            'token' => $order->token
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('capture')
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePaypalCaptureResponse($user, $order));
        $this->app->instance('payment.paypal', $paymentMock);

        $orderMock = Mockery::mock(Order::class)->makePartial();
        $orderMock->shouldReceive('find')->with($order->id)->andReturnSelf();
        $orderMock->shouldReceive('save')->andThrow(new \Exception('Confirming Payment Failed'));
        $this->app->instance(Order::class, $orderMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/capture', $data);
        Mail::assertNotSent(OrderNotification::class);
        $response->assertStatus(500)->assertJson(['error' => 'Something wrong in verify payment', 'Confirming Payment Failed']);
    }

    public function test_paypal_payment_capture_mail_throw_exception()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'PayerID' => $order->payer_id,
            'approvalId' => $order->approval_id,
            'token' => $order->token
        ];

        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('capture')
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePaypalCaptureResponse($user, $order));
        $this->app->instance('payment.paypal', $paymentMock);

        Mail::shouldReceive('to->send')
            ->once()
            ->andThrow(new \Exception('Mail send failed'));

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/capture', $data);
        $response->assertStatus(500)->assertJson(['error' => 'Something wrong in verify payment', 'Mail send failed']);
    }

    /***
     * 
     * 
     * cancelOrderPayment
     * 
     */

    public function test_cancel_order_success()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'orderId' => $order->id
        ];

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/cancel/order', $data);

        $response->assertStatus(200)->assertJson(['message' => 'Cancel order payment Success']);
        $this->assertDatabaseMissing('orders', [
            'id' => $order->id
        ]);
    }

    public function test_cancel_order_success_v2()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'orderId' => 3
        ];

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/cancel/order', $data);

        $response->assertStatus(200)->assertJson(['message' => 'Cancel order payment Success']);
        $this->assertDatabaseMissing('orders', [
            'id' => $order->id
        ]);
    }

    public function test_cancel_order_delete_throw_exception()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'orderId' => $order->id
        ];

        $orderMock = Mockery::mock(Order::class)->makePartial();
        $orderMock->shouldReceive('find')->with($order->id)->andReturnSelf();
        $orderMock->shouldReceive('delete')->andThrow(new \Exception('Canceling Order Failed'));
        $this->app->instance(Order::class, $orderMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/cancel/order', $data);


        $response->assertStatus(500);
    }

    public function test_cancel_order_delete_throw_exception_v2()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => false]
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'orderId' => 39983 // doesnt exist so find return null
        ];

        // Mock the orders relationship
        $orderRelationMock = Mockery::mock(\Illuminate\Database\Eloquent\Relations\HasMany::class)->shouldIgnoreMissing();
        $orderRelationMock->shouldReceive('where')
            ->once()
            ->with('status', false)
            ->andReturnSelf();
        $orderRelationMock->shouldReceive('delete')
            ->once()
            ->andThrow(new \Exception('Canceling Order Error'));



        $userMock = Mockery::mock($user)->makePartial();
        $userMock->shouldReceive('orders')->once()->andReturn($orderRelationMock);
        $this->app->instance(User::class, $userMock);

        // // Use $this->be() with the mocked user
        // $this->be($userMock);
        // unfinished

        $response = $this->actingAs($userMock)->postJson('/api/payment-paypal/cancel/order', $data);
        $response->assertStatus(500);
    }


    /****
     * 
     * 
     * fetchOrder
     * 
     */
    public function test_fetch_order_throw_exception()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => true, 'order_status' => 'shipped']
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'paymentId' => $order->approval_id,
            'payerId' => $order->payer_id,
        ];
        $orderMock = Mockery::mock(Order::class)->makePartial();
        $orderMock->shouldReceive('where')->with(
            ['id', '=', $order->id],
            ['approval_id', '=', $order->approval_id],
            ['payer_id', '=', $order->payer_id],
        )->andReturnSelf();
        $orderMock->shouldReceive('first')->andThrow(new \Exception('Fetching Order Failed'));
        $this->app->instance(Order::class, $orderMock);

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/fetch', $data);
        $response->assertStatus(500);
    }

    public function test_fetch_order_invalid_parameter()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => true, 'order_status' => 'shipped']
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'paymentId' => $order->approval_id,
            'payerId' => 5,
        ];

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/fetch', $data);

        $response->assertStatus(400)->assertJson(
            [
                'error' => 'The order id was invalid. please dont manipulate the order id in domain query'
            ]
        );
    }

    public function test_fetch_order_success()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id, 'status' => true, 'order_status' => 'shipped']
        );
        $orderItem = OrderItem::factory()->for($order)->forUser($user)->create();
        $data = [
            'order_id' => $order->id,
            'paymentId' => $order->approval_id,
            'payerId' => $order->payer_id,
        ];

        $response = $this->actingAs($user)->postJson('/api/payment-paypal/fetch', $data);

        $response->assertStatus(200)->assertJson(
            [
                'message' => 'Fetching Order Details',
                'data' => [
                    'order' => $order->toArray()
                ]
            ]
        );
        $data = $response->json()['data']['order'];
        $this->assertEquals($data['id'], $order->id);
    }
}
