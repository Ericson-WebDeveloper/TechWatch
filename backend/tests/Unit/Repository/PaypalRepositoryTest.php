<?php

namespace Tests\Unit\Repository;

use App\Contracts\PaymentInterface;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Mockery;
use Tests\FakePaypalCaptureResponse;
use Tests\FakePayPalResponse;
// use PHPUnit\Framework\TestCase;
use Tests\TestCase;

class PaypalRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function setup(): void
    {
        parent::setUp();
    }

    protected function tearDown(): void
    {
        Mockery::close(); // this removes lingering mocks
        parent::tearDown();
    }

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_paypal_payment_success()
    {
        $user = $this->createUserFactory();

        $paymentMock = Mockery::mock(PaymentInterface::class)->makePartial();
        $paymentMock->shouldReceive('paymentIntent')
            ->once()
            ->with(Mockery::type(Request::class))
            ->andReturn(new FakePayPalResponse($user));
        $this->app->instance('payment.paypal', $paymentMock);

        $paypal = app('payment.paypal');
        $response = $paypal->paymentIntent(new Request());

        $this->assertEquals($response->payer->name->given_name, $user->name);
        $this->assertEquals($response->payer->email_address, $user->email);
    }

    public function test_paypal_payment_failed_error()
    {
        Http::fake([
            'https://api-m.sandbox.paypal.com/*' => Http::response(['error' => 'Invalid Request'], 400),
        ]);

        $request = new Request([
            'amount' => 100,
            'details' => [
                'name' => 'John Doe',
                'barangay' => 'Brgy 1',
                'city' => 'City',
                'province' => 'Province',
                'street' => 'Main St',
                'house_no' => '12',
                'zip_code' => '1234',
            ]
        ]);

        $paypal = app('payment.paypal');
        $response = $paypal->paymentIntent($request);

        // Assert JSON response or structure
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(500, $response->status());
        $this->assertStringContainsString('Something wrong', $response->getData()->error);
    }


    public function test_paypal_payment_capture_success()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );

        $paymentMock = Mockery::mock(PaymentInterface::class)->makePartial();
        $paymentMock->shouldReceive('capture')
            ->once()
            ->with(Mockery::type(\stdClass::class))
            ->andReturn(new FakePaypalCaptureResponse($user, $order));
        $this->app->instance('payment.paypal', $paymentMock);

        $paypal = app('payment.paypal');
        $response = $paypal->capture(new \stdClass());
        $data = json_decode($response->responseBody);
        $this->assertEquals($data->id, $order->approval_id);
        $this->assertEquals($data->payer->payer_id, $order->payer_id);
        $this->assertEquals($data->payer->email_address, $user->email);
    }

    public function test_paypal_payment_capture_failed()
    {
        // Http::fake([
        //     'https://api-m.sandbox.paypal.com/*' => Http::response(['error' => 'Invalid Request'], 400),
        // ]);

        $curl = Mockery::mock('overload:curl_init');
        $curl->shouldReceive('curl_exec')->andReturn(false);
        $curl->shouldReceive('curl_error')->andReturn('Connection error');

        $user = $this->createUserFactory();
        $order = Order::factory()->create(['user_id' => $user->id]);
        $request = (object)['approvalId' => $order->approval_id, 'PayerID' => $order->payer_id];
        $paypal = app('payment.paypal');
        $response = $paypal->capture($request);
      
        // Assert JSON response or structure
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(500, $response->status());
        $this->assertStringContainsString('Something wrong', $response->getData()->error);
    }
}
