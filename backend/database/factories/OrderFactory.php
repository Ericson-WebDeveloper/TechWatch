<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'qty' => $this->faker->numberBetween(1,3),
            'status'  => $this->faker->numberBetween(0,1),
            'payment_type' => $this->faker->randomElements(['paypal', 'card'])[0],
            'approval_id' => $this->faker->numerify('approval-####'),
            'payer_id' => $this->faker->numerify('payer-####'),
            'token'  => $this->faker->numerify('token-####'),
            'order_status' => $this->faker->randomElements(['verified', 'shipped', 'delivered'])[0]
        ];
    }
}
