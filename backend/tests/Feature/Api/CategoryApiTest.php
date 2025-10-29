<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;
    private $faker;

    public function setup(): void
    {
        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_get_categories()
    {
        $response = $this->getJson('api/category');

        $response->assertStatus(200);
    }
}
