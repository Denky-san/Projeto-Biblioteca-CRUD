<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genero;

class GeneroSeeder extends Seeder
{
    public function run(): void
    {
        Genero::firstOrCreate(['nome' => 'Ficção']);
        Genero::firstOrCreate(['nome' => 'Romance']);
        Genero::firstOrCreate(['nome' => 'Fantasia']);
        Genero::firstOrCreate(['nome' => 'Aventura']);
        Genero::firstOrCreate(['nome' => 'Suspense']);
        Genero::firstOrCreate(['nome' => 'Biografia']);
    }
}
