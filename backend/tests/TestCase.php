<?php

namespace Tests;

use App\Models\BillingAddress;
use App\Models\User;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function createUserFactory(string $email = 'email@gmail.com'): User
    {
        return User::factory()->create(['email' => $email]);
    }

    public function createBillingAddressFactory(string|int $user_id)
    {
        return BillingAddress::factory()->create(['user_id' => $user_id]);
    }
}
