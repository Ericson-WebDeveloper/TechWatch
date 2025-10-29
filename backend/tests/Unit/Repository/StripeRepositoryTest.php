<?php

namespace Tests\Unit\Repository;

use App\Contracts\PaymentInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Mockery;
use PhpParser\Node\Expr\Cast\Object_;
// use PHPUnit\Framework\TestCase;
use Tests\TestCase;

class StripeRepositoryTest extends TestCase
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
    public function test_stripe_payment_intent_success()
    {
        // Mock the PaymentInterface
        $paymentMock = Mockery::mock(PaymentInterface::class);
        $paymentMock->shouldReceive('paymentIntent')
            ->once()
            ->with(Mockery::type(Request::class))
            ->andReturn((object)['id' => '142424']);

        // Bind the mock into the container
        $this->app->instance(PaymentInterface::class, $paymentMock);

        // Resolve the service
        $stripe = app(PaymentInterface::class);

        $request = new Request();
        $intent = $stripe->paymentIntent($request);

        // Assert the returned objects
        $this->assertEquals('142424', $intent->id);
    }

    public function test_stripe_capture_success()
    { // Mock the PaymentInterface
        $paymentMock = Mockery::mock(PaymentInterface::class);

        $paymentMock->shouldReceive('capture')
            ->once()
            ->with(Mockery::type(\stdClass::class))
            ->andReturn((object)['id' => '1424243', 'status' => 'failed']);

        // Bind the mock into the container
        $this->app->instance(PaymentInterface::class, $paymentMock);

        // Resolve the service
        $stripe = app(PaymentInterface::class);

        $request = new \stdClass();
        $capture = $stripe->capture($request);

        // Assert the returned objects
        $this->assertEquals('1424243', $capture->id);
        $this->assertEquals('failed', $capture->status);
    }
}
