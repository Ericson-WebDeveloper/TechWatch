<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use Database\Seeders\ProductSeeder;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class ProductApiTest extends TestCase
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
        Mockery::close();
        parent::tearDown();
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_get_products()
    {
        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure(['products']);
        $data = $response->json();
        $this->assertIsArray($data['products']);
        $this->assertNotEmpty($data['products']);
    }

    public function test_get_products_with_filter()
    {
        $response = $this->getJson('/api/products?filter=Archetype');

        $response->assertStatus(200)
            ->assertJsonStructure(['products']);
        $data = $response->json();
        $this->assertIsArray($data['products']);
        $this->assertNotEmpty($data['products']);
    }

    public function test_get_products_with_filter_invalid()
    {
        $response = $this->getJson('/api/products?filter=invalid');

        $response->assertStatus(200)
            ->assertJsonStructure(['products']);
        $data = $response->json();
        $this->assertIsArray($data['products']);
        $this->assertEmpty($data['products']);
    }

    public function test_get_products_with_filter_with_exception()
    {
        $this->withExceptionHandling();
        $this->mock(Product::class, function (MockInterface $mock) {
            $mock->shouldReceive('when')
                ->once()
                ->andReturnSelf();

            $mock->shouldReceive('get')
                ->once()
                ->andThrow(new Exception('Server Error'));
        });
        $response = $this->getJson('/api/products');

        $response->assertStatus(500)
            ->assertJsonStructure(['error'])
            ->assertJson(['error' => 'Server Error']);
    }
}
