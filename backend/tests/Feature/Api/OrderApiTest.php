<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\OrderItem;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Tests\TestCase;

class OrderApiTest extends TestCase
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
     */
    public function test_index_get_all_ordes()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        OrderItem::factory()->for($order)->create();


        $response = $this->actingAs($user)->getJson('/api/user/orders');
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);

        $this->assertNotEmpty($response->json()['data']);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'user_id' => $user->id
        ]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id
        ]);
    }

    public function test_show_order_item_null()
    {
        $user = $this->createUserFactory();

        $response = $this->actingAs($user)->getJson('/api/user/order/item/1');
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);
        $this->assertEmpty($response->json()['data']);
    }

    public function test_show_order_item_success()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $response = $this->actingAs($user)->getJson("/api/user/order/item/$orderItem->id");
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);
        $data = (object)$response->json()['data'];
        $this->assertNotNull($data);
        $this->assertEquals($data->id, $orderItem->id);
    }

    public function test_get_order_success()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $response = $this->actingAs($user)->getJson("/api/user/order/item/$orderItem->id");
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);
        $data = (object)$response->json()['data'];
        $this->assertNotNull($data);
        $this->assertEquals($data->id, $order->id);
    }

    public function test_get_order_null()
    {
        $user = $this->createUserFactory();
        $order = Order::factory()->create(
            ['user_id' => $user->id]
        );
        $orderItem = OrderItem::factory()->for($order)->create();

        $response = $this->actingAs($user)->getJson("/api/user/order/item/2");
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);
        $this->assertNull($response->json()['data']);
    }

    public function test_summary_null()
    {
        $user = $this->createUserFactory();
        $response = $this->actingAs($user)->getJson("/api/user/orders/summary");
        $response->assertStatus(200)->assertJsonStructure(['data', 'message'])
            ->assertJson(['data' =>
            [
                'total' => 0,
                'toPack' => 0,
                'toShipped' => 0,
                'Delivered' => 0,
            ]]);
    }

    public function test_summary_success()
    {
        $user = $this->createUserFactory();
        for ($i = 0; $i >= 3; $i++) {
            $order = Order::factory()->create(
                ['user_id' => $user->id]
            );
            OrderItem::factory()->for($order)->create();
        }

        $response = $this->actingAs($user)->getJson("/api/user/orders/summary");
        $response->assertStatus(200)->assertJsonStructure(['data', 'message']);
    }
}
