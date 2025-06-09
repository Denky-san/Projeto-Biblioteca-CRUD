<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livros', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('autor');
            $table->string('numero_registro')->unique();
            $table->enum('situacao', ['Disponível', 'Emprestado'])->default('Disponível');
            
            $table->foreignId('genero_id')->constrained('generos');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};
