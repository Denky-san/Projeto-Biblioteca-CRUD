<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    public function index()
    {
        return Usuario::orderBy('nome')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios',
            'numero_cadastro' => 'required|string|max:255|unique:usuarios',
        ]);

        $usuario = Usuario::create($request->all());
        return response()->json($usuario, 201);
    }

    public function show(Usuario $usuario)
    {
        return $usuario;
    }

    public function update(Request $request, Usuario $usuario)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('usuarios')->ignore($usuario->id)],
            'numero_cadastro' => ['required', 'string', 'max:255', Rule::unique('usuarios')->ignore($usuario->id)],
        ]);

        $usuario->update($request->all());
        return response()->json($usuario);
    }

    public function destroy(Usuario $usuario)
    {
        if ($usuario->emprestimos()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir este usuário, pois ele possui um histórico de empréstimos.'
            ], 409);
        }
        
        $usuario->delete();
        
        return response()->json(null, 204);
    }
}
