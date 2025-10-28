<?php

namespace Database\Factories;

use App\Models\BillingAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class BillingAddressFactory extends Factory
{
     /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BillingAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'province' => $this->faker->state,
            'city' => $this->faker->city,
            'zip_code' => (int)$this->faker->postcode,
            'barangay' => $this->faker->city,
            'street' => $this->faker->streetAddress,
            'house_no' => (int)$this->faker->postcode,
        ];
    }
}
