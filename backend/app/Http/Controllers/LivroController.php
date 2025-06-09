<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LivroController extends Controller
{
    public function index()
    {
        return Livro::with('genero')->orderBy('nome')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'numero_registro' => 'required|string|max:255|unique:livros',
            'genero_id' => 'required|exists:generos,id',
        ]);

        $livro = Livro::create($request->all());
        return response()->json($livro->load('genero'), 201);
    }

    public function show(Livro $livro)
    {
        return $livro->load('genero');
    }

    public function update(Request $request, Livro $livro)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'autor' => 'required|string|max:255',
            'numero_registro' => ['required', 'string', 'max:255', Rule::unique('livros')->ignore($livro->id)],
            'genero_id' => 'required|exists:generos,id',
            'situacao' => 'sometimes|in:Disponível,Emprestado',
        ]);

        $livro->update($request->all());
        return response()->json($livro->load('genero'));
    }

    public function destroy(Livro $livro)
    {
        if ($livro->emprestimos()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir este livro, pois ele possui um histórico de empréstimos.'
            ], 409);
        }

        $livro->delete();

        return response()->json(null, 204);
    }
}
