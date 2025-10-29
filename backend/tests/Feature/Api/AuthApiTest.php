<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;
use Laravel\Socialite\Two\User as SocialiteUser;

class AuthApiTest extends TestCase
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
    public function test_user_signin()
    {
        $user = $this->createUserFactory();

        $response = $this->postJson('/api/user/login', ['email' => $user->email, 'password' => 'password']);

        $response->assertStatus(201);
        $data = $response->json('data');
        // Assert that 'data' exists and is an array
        $this->assertIsArray($data);

        // Assert that the 'token' exists and is not empty
        $this->assertArrayHasKey('token', $data);
        $this->assertNotEmpty($data['token']);

        // Assert that the 'user' exists and has the correct email
        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('email', $data['user']);
        $this->assertEquals($user->email, $data['user']['email']);
    }

    public function test_user_signin_failed_rcredential()
    {
        $user = $this->createUserFactory();
        $response = $this->postJson('/api/user/login', ['email' => $user->email, 'password' => '12345']);

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'Invalid Credentials'
            ])
            ->assertJsonStructure(['error']);
    }

    public function test_user_signin_failed_return_500()
    {
        $this->withoutMiddleware();
        Auth::shouldReceive('attempt')
            ->once()
            ->andThrow(new \Exception('Database connection failed'));

        $user = $this->createUserFactory();
        $response = $this->postJson('/api/user/login', ['email' => $user->email, 'password' => '12345']);

        $response->assertStatus(500)
            ->assertJson([
                'error' => 'Something wrong in Server'
            ])
            ->assertJsonStructure(['error']);
    }

    /**
     * 
     * 
     * Register
     * 
     * 
     */


    public function test_user_register_422()
    {
        $user = $this->createUserFactory();

        $response = $this->postJson('/api/user/register', ['email' => 'email', 'password' => '12345']);

        $response->assertStatus(422)
            ->assertJson([
                'errors' => []
            ])
            ->assertJsonStructure(['errors']);
    }

    public function test_user_register_password_not_match()
    {
        $response = $this->postJson('/api/user/register', ['email' => 'email@gmail.com', 'password' => '12345']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password'])
            ->assertJsonFragment([
                'The password confirmation does not match.'
            ])
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'password'
                ]
            ]);
    }

    public function test_user_register_email_exist()
    {
        $user = $this->createUserFactory();

        $response = $this->postJson('/api/user/register', [
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'name' => 'Ericson'
        ]);


        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email'])
            ->assertJsonFragment([
                'The email has already been taken.'
            ])
            ->assertJsonStructure([
                'message',
                'errors' => [
                    'email'
                ]
            ]);
    }

    public function test_user_register_failed_return_500()
    {
        $this->withoutMiddleware();

        User::creating(function () {
            throw new \Exception('Database error');
        });

        $response = $this->postJson('/api/user/register', [
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'name' => 'Ericson'
        ]);

        $response->assertStatus(500)
            ->assertJson([
                'error' => 'Something wrong in Server'
            ])
            ->assertJsonStructure(['error']);
    }

    public function test_user_register_success()
    {
        $response = $this->postJson('/api/user/register', [
            'email' => 'email@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'name' => 'Ericson'
        ]);

        $response->assertStatus(201)->assertJsonStructure(['data']);
        $this->assertDatabaseHas('users', [
            'email' => 'email@gmail.com',
            'name' => 'Ericson'
        ]);
    }


    /***
     * 
     * 
     * Social Login
     * 
     * 
     * 
     */

    public function test_social_login_github_success()
    {
        $redirectUrl = 'https://github.com/o/oauth2/auth?client_id=123&redirect_uri=callback&scope=email';

        // Mock redirect response
        $redirectResponse = Mockery::mock();
        $redirectResponse->shouldReceive('getTargetUrl')
            ->once()
            ->andReturn($redirectUrl);

        // Mock Socialite driver chain
        Socialite::shouldReceive('driver')
            ->with('github')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('redirect')
            ->once()
            ->andReturn($redirectResponse);

        $response = $this->postJson('/api/user/github/login');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Redirect to Github Login',
                'link' => $redirectUrl
            ])
            ->assertJsonStructure([
                'message',
                'link'
            ]);
    }

    public function test_socialite_login_github_callback_success_with_new_user()
    {
        // Mock Socialite user
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Social Name');
        $socialiteUser->shouldReceive('getNickname')->andReturn('socialuser');
        $socialiteUser->shouldReceive('getId')->andReturn('12345');

        // $mockUser = Mockery::mock(User::class);
        // $mockUser->shouldReceive('createToken')
        // ->once()
        // ->andReturn((object)['plainTextToken' => 'fake-token-123']);


        // // mock where()->first()
        // $mockUser->shouldReceive('where')
        //     ->once()
        //     ->with('email', 'email@gmail.com')
        //     ->andReturnSelf();

        // $mockUser->shouldReceive('first')
        //     ->once()
        //     ->andReturn(null); // simulate user not existing

        // mock create()
        // $mockUser->shouldReceive('create')
        //     ->once()
        //     ->andReturn($mockUser);

        // Mock Socialite facade
        Socialite::shouldReceive('driver')
            ->with('github')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andReturn($socialiteUser);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'github'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user'
                ]
            ]);
    }


    public function test_socialite_login_github_callback_success_with_existing_user()
    {
        $userFactory = $this->createUserFactory('existing@example.com');
        // Mock Socialite user
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Social Name');
        $socialiteUser->shouldReceive('getNickname')->andReturn('socialuser');
        $socialiteUser->shouldReceive('getId')->andReturn('12345');

        // Mock Socialite facade
        Socialite::shouldReceive('driver')
            ->with('github')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andReturn($socialiteUser);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'github'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user'
                ]
            ]);
        $data = $response->json()['data'];
        $this->assertEquals($data['user']['email'], $userFactory->email);
        $this->assertNotEmpty($data['token']);
    }


    public function test_socialite_login_github_callback_failed()
    {
        $this->withExceptionHandling();

        // Mock the Socialite driver
        $mockDriver = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $mockDriver->shouldReceive('stateless')->andReturnSelf(); // allow stateless chaining
        $mockDriver->shouldReceive('user')
            ->once()
            ->andThrow(new \Exception('Forced OAuth error'));

        // Mock the Socialite facade
        Socialite::shouldReceive('driver')
            ->once()
            ->with('github') // or $request->provider value
            ->andReturn($mockDriver);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'github'
        ]);

        $response->assertStatus(500)
            ->assertJsonStructure([
                'error'
            ])
            ->assertJson([
                'error' => 'Something wrong in Server',
            ]);
    }

    public function test_socialite_login_goggle_callback_success_with_new_user()
    {
        // Mock Socialite user
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Social Name');
        $socialiteUser->shouldReceive('getNickname')->andReturn('socialuser');
        $socialiteUser->shouldReceive('getId')->andReturn('12345');

        // $mockUser = Mockery::mock(User::class);
        // $mockUser->shouldReceive('createToken')
        // ->once()
        // ->andReturn((object)['plainTextToken' => 'fake-token-123']);


        // // mock where()->first()
        // $mockUser->shouldReceive('where')
        //     ->once()
        //     ->with('email', 'email@gmail.com')
        //     ->andReturnSelf();

        // $mockUser->shouldReceive('first')
        //     ->once()
        //     ->andReturn(null); // simulate user not existing

        // mock create()
        // $mockUser->shouldReceive('create')
        //     ->once()
        //     ->andReturn($mockUser);

        // Mock Socialite facade
        Socialite::shouldReceive('driver')
            ->with('google')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andReturn($socialiteUser);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'google'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user'
                ]
            ]);
    }


    public function test_socialite_login_goggle_callback_success_with_existing_user()
    {
        $userFactory = $this->createUserFactory('existing@example.com');
        // Mock Socialite user
        $socialiteUser = Mockery::mock(SocialiteUser::class);
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Social Name');
        $socialiteUser->shouldReceive('getNickname')->andReturn('socialuser');
        $socialiteUser->shouldReceive('getId')->andReturn('12345');

        // Mock Socialite facade
        Socialite::shouldReceive('driver')
            ->with('google')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('user')
            ->once()
            ->andReturn($socialiteUser);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'google'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user'
                ]
            ]);
        $data = $response->json()['data'];
        $this->assertEquals($data['user']['email'], $userFactory->email);
        $this->assertNotEmpty($data['token']);
    }


    public function test_socialite_login_goggle_callback_failed()
    {
        $this->withExceptionHandling();

        // Mock the Socialite driver
        $mockDriver = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $mockDriver->shouldReceive('stateless')->andReturnSelf(); // allow stateless chaining
        $mockDriver->shouldReceive('user')
            ->once()
            ->andThrow(new \Exception('Forced OAuth error'));

        // Mock the Socialite facade
        Socialite::shouldReceive('driver')
            ->once()
            ->with('google') // or $request->provider value
            ->andReturn($mockDriver);

        $response = $this->postJson('/api/user/login/social/callback', [
            'provider' => 'google'
        ]);

        $response->assertStatus(500)
            ->assertJsonStructure([
                'error'
            ])
            ->assertJson([
                'error' => 'Something wrong in Server',
            ]);
    }

    public function test_social_login_google_success()
    {
        $redirectUrl = 'https://accounts.google.com/o/oauth2/auth?client_id=123&redirect_uri=callback&scope=email';

        // Mock redirect response
        $redirectResponse = Mockery::mock();
        $redirectResponse->shouldReceive('getTargetUrl')
            ->once()
            ->andReturn($redirectUrl);

        // Mock Socialite driver chain
        Socialite::shouldReceive('driver')
            ->with('google')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('stateless')
            ->once()
            ->andReturnSelf();

        Socialite::shouldReceive('redirect')
            ->once()
            ->andReturn($redirectResponse);

        $response = $this->postJson('/api/user/google/login');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Redirect to Google Login',
                'link' => $redirectUrl
            ])
            ->assertJsonStructure([
                'message',
                'link'
            ]);
    }
}
