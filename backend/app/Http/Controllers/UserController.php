<?php

namespace App\Http\Controllers;

use App\Http\Requests\BillingAddressrequest;
use App\Mail\ResetPasswordMail;
use Exception;
use App\Models\User;
use App\Models\UserVerify;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{


    public function updateProfile(Request $request)
    {
        try {
            $user = request()->user();

            $newuser = User::find($user->id);

            $newuser->name = $request->input('name');
            $newuser->email = $request->input('email');
            if($newuser->save()) {
                return response()->json([
                    'message' => 'User Profile Updated!',
                    'data' => [
                        'user' => $newuser
                    ]
                ], 200);
            } else {
                return response()->json([
                    'error' => 'User Profile Failed!'
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server!'
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $user = request()->user();

            $newuser = User::find($user->id);

            $newuser->password = Hash::make($request->input('password'));

            if($newuser->save()) {
                return response()->json([
                    'message' => 'User Password Updated!',
                    'data' => [
                        'user' => $newuser
                    ]
                ], 200);
            } else {
                return response()->json([
                    'error' => 'User Password Failed!'
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server!'
            ], 500);
        }
    }

    public function getBilling(Request $request)
    {
        $user = request()->user();

        $newuser = User::find($user->id);

        return response()->json([
            'message' => 'User Billing Fetch!',
            'data' => [
                'billing' => $newuser->billingaddress
            ]
        ], 200);
    }

    public function updateBilling(BillingAddressrequest $request)
    {
        try {
            $user = request()->user();

            $newuser = User::find($user->id);

            if($newuser->billingaddress) {
                $result = $newuser->billingaddress()->update([
                    'province' => $request->province,
                    'city' => $request->city,
                    'zip_code' => $request->zip_code,
                    'barangay' => $request->barangay,
                    'street' => $request->street,
                    'house_no' => $request->house_no,
                ]);
                if($result) {
                    return response()->json([
                        'message' => 'User Billing Update Success!',
                        'data' => [
                            'billing' => request()->user()->billingaddress
                        ]
                    ], 200);
                } else {
                    return response()->json([
                        'errors' => 'User Billing Update Failed!'
                    ], 400);
                }
            } else {
                $result = $newuser->billingaddress()->create([
                    'province' => $request->province,
                    'city' => $request->city,
                    'zip_code' => $request->zip_code,
                    'barangay' => $request->barangay,
                    'street' => $request->street,
                    'house_no' => $request->house_no,
                ]);
                if($result) {
                    return response()->json([
                        'message' => 'User Billing Created Success!',
                        'data' => [
                            'billing' => request()->user()->billingaddress
                        ]
                    ], 200);
                } else {
                    return response()->json([
                        'error' => 'User Billing Created Failed!'
                    ], 400);
                }
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server!',
                // $e->getMessage()
            ], 500);
        }
    }

    public function crypto_rand_secure($min, $max)
    {
        $range = $max - $min;
        if ($range < 1) return $min; // not so random...
        $log = ceil(log($range, 2));
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd > $range);
        return $min + $rnd;
    }

    public function getTokenCode($length)
    {
        $token = "";
        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet .= "0123456789";
        $max = strlen($codeAlphabet); // edited

        for ($i = 0; $i < $length; $i++) {
            $token .= $codeAlphabet[$this->crypto_rand_secure(0, $max - 1)];
        }

        return $token;
    }

    public function forgotPassword(Request $request)
    {
        try {
            $user = DB::table('users')->where('email', '=', $request->email)->first();
            if(!$user) {
                return response()->json(['message' => 'Invalid email not exist in system'], 400);
            }
            // generate code 
            $code = $this->getTokenCode(10);
            // create record of verify code
            $response = UserVerify::create([
                'email' => $user->email, 
                'code' => $code, 
                'created' => now('Asia/Manila')]);
            if(!$response) {
                return response()->json(['message' => 'Sorry you cannot reset your password this time. please try again later.'], 400);
            }
            // send to email the link of page where rest password
            Mail::to($user->email)->send(new ResetPasswordMail($code));

            return response()->json(['message' => 'link was send to your email.'], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server!',
                'stack' => $e->getMessage()
            ], 500);
        }
    }

    public function resettingPassword(Request $request)
    {
        try {
            $verifyCode = DB::table('user_verifies')->where('code', '=', $request->code)->first();

            $now = Carbon::now('Asia/Manila');

            if (!$verifyCode) {
                return response()->json(['message' => 'Invalid Code Verification'], 400);
            }
            $seconds = $now->diffInSeconds($verifyCode->created);
            // 300 seconds -> 5 minutes
            // 86400 seconds -> 1 day
            if ($seconds >= 300) {
                DB::table('user_verifies')->where('code', '=', $request->code)->delete();
                return response()->json(['message' => 'Token Code Expires. Please Request new Account'], 400);
            }

            $response = DB::table('users')->where('email', '=', $verifyCode->email)
            ->update(['password' => Hash::make($request->password)]);

            if($response == 0) {
                DB::table('user_verifies')->where('code', '=', $request->code)->delete();
                return response()->json(['message' => 'Password Updated Failed'], 400);
            } else {
                return response()->json(['message' => 'Password Updated Success'], 200);
            }

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Something wrong in server!',
                'stack' => $e->getMessage()
            ], 500);
        }
    }

}
