<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{

    use HasFactory;

    protected $guarded = [];

    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }

    public function getDetailsAttribute($value)
    {
        return json_decode($value);
    }

    public function getItemsAttribute($value)
    {
        return json_decode($value);
    }

}
