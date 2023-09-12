<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterRequest;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password)
            ]);
            return response()->json([
                'message' => 'Register Success!',
                'data' => $user
            ], 201);
        }catch(Exception $e) {
            return response()->json([
                'error' => 'Something wrong in Server'
            ], 500);
        }


    }

    public function login(Request $request)
    {
        try{
            if(!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                return response()->json([
                    'error' => 'Invalid Credentials'
                ], 400);
            } else {
                $user = User::where('email', $request->email)->first();

                $token = $user->createToken('TechWatch')->plainTextToken;

                return response()->json([
                    'message' => 'Login Success!',
                    'data' => [
                        'token' => $token,
                        'user' => $user
                    ]
                ], 201);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in Server'
            ], 500);
        }
    }

    public function login_social_account(Request $request)
    {
        try {
            $urlLink = Socialite::driver($request->provider)->stateless()->redirect()->getTargetUrl();

            return response()->json([
                'message' => 'Redirect to Google Login',
                'link' => $urlLink
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something wrong in Server',
            ], 500);
        }

    }

    public function login_social_callback(Request $request)
    {
        try {
            $user = Socialite::driver($request->provider)->stateless()->user();

            $userexist = User::where('email', $user->getEmail())->first();

            if($userexist) {

                $token = $userexist->createToken('TechWatch')->plainTextToken;

            } else {

                $userexist = User::create([
                    'name' => $user->getNickname() ?? $user->getName(),
                    'email' => $user->getEmail(),
                    'password' => bcrypt($user->getId() . $user->getNickname() . $user->getEmail())
                ]);

                $token = $userexist->createToken('TechWatch')->plainTextToken;

            }

            return response()->json([
                'message' => 'Login Success!',
                'data' => [
                    'token' => $token,
                    'user' => $userexist
                ]
            ], 201);
        } catch(Exception $e) {
            return response()->json([
                'error' => 'Something wrong in Server',
                $e->getMessage()
            ], 500);
        }

    }


}
