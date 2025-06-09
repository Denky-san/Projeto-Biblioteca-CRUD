<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\LivroController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Controllers\GeneroController;

// Rotas para Gêneros
Route::get('/generos', [GeneroController::class, 'index']);

// Rotas para Usuários
Route::apiResource('usuarios', UsuarioController::class);

// Rotas para Livros
Route::apiResource('livros', LivroController::class);

// Rotas para Empréstimos
Route::get('/emprestimos', [EmprestimoController::class, 'index']);
Route::post('/emprestimos', [EmprestimoController::class, 'store']);
Route::patch('/emprestimos/{emprestimo}/devolver', [EmprestimoController::class, 'devolver']);
