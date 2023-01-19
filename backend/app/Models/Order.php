<?php

namespace App\Models;

use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Dyrynda\Database\Support\GeneratesUuid;

class Order extends Model
{
    use HasFactory;


    // public $incrementing = false;

    // protected $keyType = 'string';

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem()
    {
        return $this->hasOne('App\Models\OrderItem');
    }
}
