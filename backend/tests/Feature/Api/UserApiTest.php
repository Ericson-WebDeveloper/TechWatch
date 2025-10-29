<?php

namespace Tests\Feature\Api;

use App\Mail\ResetPasswordMail;
use App\Models\BillingAddress;
use App\Models\User;
use App\Models\UserVerify;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Js;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class UserApiTest extends TestCase
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
    public function test_resetting_password_failed_verify()
    {
        // $user = $this->createUserFactory();
        // $this->actingAs($user);

        $response = $this->postJson('/api/user/reset-password', ['code' => '111']);

        $response->assertStatus(400)->assertJson(['message' => 'Invalid Code Verification']);
    }

    public function test_resetting_password_failed_verify_null()
    {
        // Mock the query builder returned by DB::table()
        $mockQuery = Mockery::mock();
        $mockQuery->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuery->shouldReceive('first')->andReturn(null);

        // Mock the DB facade to return the query mock
        DB::shouldReceive('table')
            ->once()
            ->with('user_verifies')
            ->andReturn($mockQuery);

        $response = $this->postJson('/api/user/reset-password', ['code' => '111']);
        $response->assertStatus(400)->assertJson(['message' => 'Invalid Code Verification']);
    }

    public function test_resetting_password_failed_code_expired()
    {
        // Mock the query builder returned by DB::table()
        $mockQuery = Mockery::mock();
        $mockQuery->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuery->shouldReceive('first')->andReturn((object)['created' => now()->subMinutes(20)]);

        //     $mockQuery->shouldReceive('delete')
        // ->once()
        // ->andReturnTrue(); // or whatever your code expects

        // Mock the DB facade to return the query mock
        DB::shouldReceive('table')
            ->once()
            ->with('user_verifies')
            ->andReturn($mockQuery);

        $mockQuery2 = Mockery::mock();
        $mockQuery2->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuery2->shouldReceive('delete')->andReturnTrue();

        DB::shouldReceive('table')
            ->once()
            ->with('user_verifies')
            ->andReturn($mockQuery2);

        $response = $this->postJson('/api/user/reset-password', ['code' => '111']);
        $response->assertStatus(400)->assertJson(['message' => 'Token Code Expires. Please Request new Account']);
    }

    public function test_resetting_password_failed_update()
    {
        $user = $this->createUserFactory();
        // Mock the query builder returned by DB::table()
        $mockQuery = Mockery::mock();
        $mockQuery->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuery->shouldReceive('first')->andReturn((object)['created' => now(), 'email' => $user->email, 'password' => 'Pass@123']);

        $mockUsers = Mockery::mock();
        $mockUsers->shouldReceive('where')
            ->with('email', '=', $user->email)
            ->andReturnSelf();
        $mockUsers->shouldReceive('update')
            ->andReturn(0); // simulate success (1 row updated)


        $mockQuerydelete = Mockery::mock();
        $mockQuerydelete->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuerydelete->shouldReceive('delete')->andReturnTrue(); //

        // Mock the DB facade to return the query mock
        DB::shouldReceive('table')
            ->once()
            ->with('user_verifies')
            ->andReturn($mockQuery);

        DB::shouldReceive('table')
            ->with('users')
            ->andReturn($mockUsers);

        DB::shouldReceive('table')
            ->with('user_verifies')
            ->andReturn($mockQuerydelete);

        $response = $this->postJson('/api/user/reset-password', ['code' => '111']);
        $response->assertStatus(400)->assertJson(['message' => 'Password Updated Failed']);
    }

    public function test_resetting_password_success()
    {
        $user = $this->createUserFactory();
        // Mock the query builder returned by DB::table()
        $mockQuery = Mockery::mock();
        $mockQuery->shouldReceive('where')->with('code', '=', '111')->andReturnSelf();
        $mockQuery->shouldReceive('first')->andReturn((object)['created' => now(), 'email' => $user->email, 'password' => 'Pass@123']);

        $mockUsers = Mockery::mock();
        $mockUsers->shouldReceive('where')
            ->with('email', '=', $user->email)
            ->andReturnSelf();
        $mockUsers->shouldReceive('update')
            ->andReturn(1); // simulate success (1 row updated)

        // Mock the DB facade to return the query mock
        DB::shouldReceive('table')
            ->once()
            ->with('user_verifies')
            ->andReturn($mockQuery);
        DB::shouldReceive('table')
            ->with('users')
            ->andReturn($mockUsers);

        $response = $this->postJson('/api/user/reset-password', ['code' => '111']);
        $response->assertStatus(200)->assertJson(['message' => 'Password Updated Success']);
    }

    /**
     * 
     * forgotPassword
     * 
     * 
     */

    public function test_forget_password_success()
    {
        Mail::fake();
        $user = $this->createUserFactory();
        $data = [
            'email' => $user->email,
        ];

        $response = $this->postJson('/api/user/forgot-password', $data);
        $response->assertStatus(200)->assertJson(['message' => 'link was send to your email.']);

        Mail::assertSent(ResetPasswordMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }
    // php artisan test tests/Feature/Api/UserApiTest.php --filter=test_forget_password_success
    // php artisan test tests/Feature/Api/UserApiTest.php
    public function test_forget_password_email_invalid()
    {
        $response = $this->postJson('/api/user/forgot-password', ['email' => 'email@gmail.com']);
        $response->assertStatus(400)->assertJson(['message' => 'Invalid email not exist in system']);
    }

    public function test_forget_password_create_token_failed(): void
    {
        $user = $this->createUserFactory();
        $data = [
            'email' => $user->email
        ];

        // $mock = Mockery::mock('overload:' .UserVerify::class);
        // //$mock = Mockery::mock('alias:' . UserVerify::class);
        // $mock->shouldReceive('create')->once()->andReturnFalse();
        // // $this->app->instance(UserVerify::class, $mock);
        // Use Laravel's mock helper, which works with dependency injection
        $this->mock(UserVerify::class, function (Mockery\MockInterface $mock) {
            $mock->shouldReceive('create')->once()->andReturn(false);
        });

        $response = $this->postJson('/api/user/forgot-password', $data);

        $response->assertStatus(400)->assertJson(['message' => 'Sorry you cannot reset your password this time. please try again later.']);
    }


    /****
     * 
     * 
     * updateProfile
     * 
     * 
     */

    public function test_update_profile_500_error()
    {
        $user = $this->createUserFactory();
        $data = [
            'name' => 'Update Name',
            'email' => ''
        ];

        $response = $this->actingAs($user)->postJson('/api/user/profile-update', $data);
        $response->assertStatus(500)
            ->assertJsonStructure(['error'])
            ->assertJson(['error' => 'Something wrong in server!']);
    }

    public function test_update_profile_save_failed()
    {
        $user = $this->createUserFactory();
        $data = [
            'name' => 'Update Name',
            'email' => 'email@gmail.com'
        ];

        // Create a mock of the User model
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->shouldReceive('find')
            ->with($user->id)
            ->once()
            ->andReturnSelf();

        $userMock->shouldReceive('save')
            ->once()
            ->andReturn(false);

        // Bind the mock to the container
        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/profile-update', $data);

        $response->assertStatus(400)
            ->assertJsonStructure(['error'])
            ->assertJson(['error' => 'User Profile Failed!']);
    }

    public function test_update_profile_save_success()
    {
        $user = $this->createUserFactory();
        $data = [
            'name' => 'Update Name',
            'email' => 'email@gmail.com'
        ];

        $response = $this->actingAs($user)->postJson('/api/user/profile-update', $data);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'data' => ['user']])
            ->assertJson(['message' => 'User Profile Updated!']);
        $this->assertDatabaseHas('users', [
            'email' => 'email@gmail.com'
        ]);
    }

    /***
     * 
     * updatePassword
     * 
     */
    public function test_update_password_throw_exception()
    {
        $user = $this->createUserFactory();
        $data = [
            'password' => '12345',
        ];

        // Create a mock of the User model
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->shouldReceive('find')
            ->with($user->id)
            ->once()
            ->andThrow(new \Exception('Server error.'));
        // Bind the mock to the container
        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/password-update', $data);
        $response->assertStatus(500)
            ->assertJsonStructure(['error'])
            ->assertJson(['error' => 'Something wrong in server!']);
    }

    public function test_update_password_bad_request()
    {
        $user = $this->createUserFactory();
        $data = [
            'password' => '12345',
        ];

        // Create a mock of the User model
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturnSelf();

        $userMock->shouldReceive('save')
            ->once()
            ->andReturnFalse();
        // Bind the mock to the container
        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/password-update', $data);
        $response->assertStatus(400)
            ->assertJsonStructure(['error'])
            ->assertJson(['error' => 'User Password Failed!']);
    }

    public function test_update_password_find_failed()
    {
        $user = $this->createUserFactory();
        $data = [
            'password' => '12345',
        ];

        // Create a mock of the User model
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturnNull();
        // Bind the mock to the container
        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/password-update', $data);
        $response->assertStatus(500);
    }

    public function test_update_password_success()
    {
        $user = $this->createUserFactory();
        $data = [
            'password' => '12345',
        ];

        $response = $this->actingAs($user)->postJson('/api/user/password-update', $data);
        $response->assertStatus(200)->assertJsonStructure(['message'])
            ->assertJson(['message' => 'User Password Updated!']);
    }

    public function test_get_billing_address_success()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = (object)[
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => $this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => $this->faker->postcode,
            'id' => 1,
            'user_id' => $user->id
        ];

        $user->billingaddress = $billing;
        // Create a mock of the User model
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->shouldReceive('find')
            ->with($user->id)
            ->once()
            ->andReturn($user);
        // Bind the mock to the container
        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->getJson('/api/user/billing-address');

        $response->assertStatus(200)->assertJsonStructure(["message", "data"])->assertJson([
            "message" => "User Billing Fetch!",
            "data" => ["billing" => (array)$billing]
        ]);
    }


    /***
     * 
     * 
     * updateBilling
     * 
     * 
     */
    public function test_update_new_billing_success()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
            'id' => 1,
            'user_id' => $user->id
        ];

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(200)->assertJsonStructure(["message", "data"])->assertJson([
            "message" => "User Billing Created Success!",
            "data" => ["billing" => $billing]
        ]);
    }

    public function test_update_existing_billing_success()
    {
        $user = $this->createUserFactory();
        $userBilling = $this->createBillingAddressFactory($user->id);
        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(200)->assertJsonStructure(["message", "data"])->assertJson([
            "message" => "User Billing Update Success!",
            "data" => ["billing" => $billing]
        ]);
    }


    public function test_update_new_billing_failed()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
            'id' => 1,
            'user_id' => $user->id
        ];

        // shouldIgnoreMissing() will handle any unexpected method calls
        // Mock relationship
        $relationshipMock = Mockery::mock(\Illuminate\Database\Eloquent\Relations\HasOne::class)->shouldIgnoreMissing();
        $relationshipMock->shouldReceive('create')
            ->with($billing)
            ->andReturnNull()
            ->shouldReceive('update')
            ->with($billing)
            ->andReturnNull();

        // Mock User
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->id = $user->id;
        $userMock->billingaddress = null;
        $userMock->shouldReceive('find')->andReturnSelf();
        $userMock->shouldReceive('billingaddress')->andReturn($relationshipMock);

        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'User Billing Created Failed!'  // Note: singular 'error'
            ]);;
    }

    public function test_update_existing_billing_failed()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];

        // shouldIgnoreMissing() will handle any unexpected method calls
        // Mock relationship
        $relationshipMock = Mockery::mock(\Illuminate\Database\Eloquent\Relations\HasOne::class)->shouldIgnoreMissing();
        $relationshipMock->shouldReceive('create')
            ->with($billing)
            ->andReturnNull()
            ->shouldReceive('update')
            ->with($billing)
            ->andReturnNull();

        // Mock User
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->id = $user->id;
        $userMock->billingaddress = $this->createBillingAddressFactory($user->id);
        $userMock->shouldReceive('find')->andReturnSelf();
        $userMock->shouldReceive('billingaddress')->andReturn($relationshipMock);

        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(400)
            ->assertJson([
                'errors' => 'User Billing Update Failed!'  // Note: singular 'error'
            ]);
    }

    public function test_update_billing_find_throw_exception()
    {
        $user = $this->createUserFactory();
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->id = $user->id;
        $userMock->shouldReceive('find')->once()->with($user->id)->andThrow(new \Exception('Server Error'));

        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(500);
    }


    public function test_update_existing_billing_throw_exception()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];

        // shouldIgnoreMissing() will handle any unexpected method calls
        // Mock relationship
        $relationshipMock = Mockery::mock(\Illuminate\Database\Eloquent\Relations\HasOne::class)->shouldIgnoreMissing();
        $relationshipMock->shouldReceive('create')
            ->with($billing)
            ->andThrow(new \Exception('Create new Billing Error'))
            ->shouldReceive('update')
            ->with($billing)
            ->andThrow(new \Exception('Update Billing Error'));

        // Mock User
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->id = $user->id;
        $userMock->billingaddress = $this->createBillingAddressFactory($user->id);
        $userMock->shouldReceive('find')->andReturnSelf();
        $userMock->shouldReceive('billingaddress')->andReturn($relationshipMock);

        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(500);
    }


    public function test_update_new_billing_throw_exception()
    {
        $user = $this->createUserFactory();

        // Step 1: Mock a billing address object
        $billing = [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];

        // shouldIgnoreMissing() will handle any unexpected method calls
        // Mock relationship
        $relationshipMock = Mockery::mock(\Illuminate\Database\Eloquent\Relations\HasOne::class)->shouldIgnoreMissing();
        $relationshipMock->shouldReceive('create')
            ->with($billing)
            ->andThrow(new \Exception('Create new Billing Error'))
            ->shouldReceive('update')
            ->with($billing)
            ->andThrow(new \Exception('Update Billing Error'));

        // Mock User
        $userMock = Mockery::mock(User::class)->makePartial();
        $userMock->id = $user->id;
        // $userMock->billingaddress = null;
        $userMock->shouldReceive('find')->andReturnSelf();
        $userMock->shouldReceive('billingaddress')->andReturn($relationshipMock);

        $this->app->instance(User::class, $userMock);

        $response = $this->actingAs($user)->postJson('/api/user/billing-address/update', $billing);

        $response->assertStatus(500);
    }
}
