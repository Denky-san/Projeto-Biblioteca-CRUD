<?php

namespace App\Http\Controllers;

use App\Models\Emprestimo;
use App\Models\Livro;
use Illuminate\Http\Request;
use Carbon\Carbon;

class EmprestimoController extends Controller
{
    public function index()
    {
        $emprestimosAtivos = Emprestimo::where('status', 'Emprestado')->get();

        foreach ($emprestimosAtivos as $emprestimo) {
            // Se a data de devolução passou e o status ainda é "Emprestado", atualiza para "Atrasado"
            // Decidi automatizar o sistema ao inves de ter que marcar um livro como "Atrasado"
            if (now()->gt($emprestimo->data_devolucao)) {
                $emprestimo->update(['status' => 'Atrasado']);
            }
        }

        return Emprestimo::with(['usuario', 'livro'])->orderBy('data_emprestimo', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'livro_id' => 'required|exists:livros,id',
            'data_devolucao' => 'required|date|after_or_equal:today',
        ]);

        $livro = Livro::findOrFail($request->livro_id);

        if ($livro->situacao !== 'Disponível') {
            return response()->json(['message' => 'Este livro não está disponível para empréstimo.'], 422);
        }

        $livro->update(['situacao' => 'Emprestado']);

        $emprestimo = Emprestimo::create([
            'usuario_id' => $request->usuario_id,
            'livro_id' => $request->livro_id,
            'data_emprestimo' => Carbon::now(),
            'data_devolucao' => $request->data_devolucao,
            'status' => 'Emprestado',
        ]);

        return response()->json($emprestimo->load(['usuario', 'livro']), 201);
    }

    public function devolver(Emprestimo $emprestimo)
    {
        if ($emprestimo->status === 'Devolvido') {
             return response()->json(['message' => 'Este livro já foi devolvido.'], 422);
        }
        
        $emprestimo->livro()->update(['situacao' => 'Disponível']);
        
        $emprestimo->update(['status' => 'Devolvido']);

        return response()->json($emprestimo->load(['usuario', 'livro']));
    }
}
