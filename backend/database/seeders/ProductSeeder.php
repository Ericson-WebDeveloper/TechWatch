<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $images = ['Apple_Watch_Series_4_Extract.png', 'Leatherwatch.jpg', 'luxury watch.jpg', 'OnePlus.png'];

        Product::create([
            'name' => 'Archetype Archer Automatic Silver Tan Navy',
            'slug' => Str::slug('Archetype Archer Automatic Silver Tan Navy'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Archetype Archer Automatic Silver Tan Navy.png',
            'categories' => 'Archetype'
        ]);

        Product::create([
            'name' => 'Archetype Nemesis Automatic All Black Lime',
            'slug' => Str::slug('Archetype Nemesis Automatic All Black Lime'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Archetype Nemesis Automatic All Black Lime.png',
            'categories' => 'Archetype'
        ]);

        Product::create([
            'name' => 'G-Shock GA2200 Ana-Digi Digital Glitch Black Green',
            'slug' => Str::slug('G-Shock GA2200 Ana-Digi Digital Glitch Black Green'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'G-Shock GA2200 Ana-Digi Digital Glitch Black Green.png',
            'categories' => 'G-Shock'
        ]);

        Product::create([
            'name' => 'G-Shock GBA900 G-Squad Green',
            'slug' => Str::slug('G-Shock GBA900 G-Squad Green'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'G-Shock GBA900 G-Squad Green.png',
            'categories' => 'G-Shock'
        ]);

        
        Product::create([
            'name' => 'G-Shock GMAS2100 Metalic Silver',
            'slug' => Str::slug('G-Shock GMAS2100 Metalic Silver'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'G-Shock GMAS2100 Metalic Silver.png',
            'categories' => 'G-Shock'
        ]);

        Product::create([
            'name' => 'G-Shock GSTB400 G-Steel Black Gold',
            'slug' => Str::slug('G-Shock GSTB400 G-Steel Black Gold'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'G-Shock GSTB400 G-Steel Black Gold.png',
            'categories' => 'G-Shock'
        ]);

        Product::create([
            'name' => 'Mazzucato RIM Monza Racing Automatic Black Yellow',
            'slug' => Str::slug('Mazzucato RIM Monza Racing Automatic Black Yellow'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Mazzucato RIM Monza Racing Automatic Black Yellow.png',
            'categories' => 'Mazzucato'
        ]);

        Product::create([
            'name' => 'Shinola Runwell 41mm White Green',
            'slug' => Str::slug('Shinola Runwell 41mm White Green'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Shinola Runwell 41mm White Green.png',
            'categories' => 'Shinola'
        ]);

        Product::create([
            'name' => 'Shinola Sea Creatures Detrola 40mm Blue White',
            'slug' => Str::slug('Shinola Sea Creatures Detrola 40mm Blue White'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Shinola Sea Creatures Detrola 40mm Blue White.png',
            'categories' => 'Shinola'
        ]);

        Product::create([
            'name' => 'Timex Midtown 36mm Silver SS',
            'slug' => Str::slug('Timex Midtown 36mm Silver SS'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Timex Midtown 36mm Silver SS.png',
            'categories' => 'Timex'
        ]);

        Product::create([
            'name' => 'Timex Q x BCRF 36mm Pink SS',
            'slug' => Str::slug('Timex Q x BCRF 36mm Pink SS'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Timex Q x BCRF 36mm Pink SS.png',
            'categories' => 'Timex'
        ]);

        Product::create([
            'name' => 'Timex T80 x Space Invaders 34mm Silver SS',
            'slug' => Str::slug('Timex T80 x Space Invaders 34mm Silver SS'),
            'price' => (rand(999, 1000) * 100),
            'qty' => rand(1, 100),
            'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
            'img' => 'Timex T80 x Space Invaders 34mm Silver SS.png',
            'categories' => 'Timex'
        ]);

        // Product::create([
        //     'name' => 'Leatherwatch',
        //     'slug' => Str::slug('Leatherwatch'),
        //     'price' => (rand(999, 1000) * 100),
        //     'qty' => rand(1, 100),
        //     'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
        //     'img' => $images[1]
        // ]);

        // Product::create([
        //     'name' => 'luxury watch',
        //     'slug' => Str::slug('luxury watch'),
        //     'price' => (rand(999, 1000) * 100),
        //     'qty' => rand(1, 100),
        //     'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
        //     'img' => $images[2]
        // ]);

        // Product::create([
        //     'name' => 'OnePlus',
        //     'slug' => Str::slug('OnePlus'),
        //     'price' => (rand(999, 1000) * 100),
        //     'qty' => rand(1, 100),
        //     'desc' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, temporibus atque nostrum reiciendis blanditiis, tempore magnam consectetur ipsa dolore accusantium necessitatibus voluptatibus. Dolorum similique magni tempora officia ipsa quidem? Culpa.',
        //     'img' => $images[3]
        // ]);
    }
}
