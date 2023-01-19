<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('user_id');
            $table->float('amount', 8, 2);
            $table->integer('qty');
            $table->boolean('status')->default(false);
            // change status to payment_ststaus. then add status -> Verified Shipped Recieved
            //$table->enum('order_status', ['verified', 'shipped', 'delivered'])->nullable(); // new need to migrate
            $table->enum('payment_type', ['paypal', 'card'])->nullable();
            $table->string('approval_id')->nullable();
            $table->string('payer_id')->nullable();
            $table->string('token')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
