<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{

     /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_id' => Order::factory(),
            'items' => json_encode([
                'amount' => $this->faker->randomFloat(2),
                'qty' => $this->faker->numberBetween(1,3),
            ]),
            'details' => json_encode([
                    'name' => $this->faker->name,
                    'email' => $this->faker->safeEmail,
                    'province' => $this->faker->state,
                    'city' => $this->faker->city,
                    'barangay' => $this->faker->streetName,
                    'street' => $this->faker->streetAddress,
                    'house_no' => $this->faker->buildingNumber,
                    'zip_code' => $this->faker->postcode,
                ])
        ];
    }

    /**
     * State to inject user data
     */
    public function forUser(User $user)
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'details' => json_encode([
                    'name' => $user->name,
                    'email' => $user->email,
                    // 'province' => $this->faker->state,
                    // 'city' => $this->faker->city,
                    // 'barangay' => $this->faker->streetName,
                    // 'street' => $this->faker->streetAddress,
                    // 'house_no' => $this->faker->buildingNumber,
                    // 'zip_code' => $this->faker->postcode,
                ]),
            ];
        });
    }
}
