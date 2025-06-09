<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livro extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'autor', 'numero_registro', 'situacao', 'genero_id'];

    public function genero()
    {
        return $this->belongsTo(Genero::class);
    }

    public function emprestimos()
    {
        return $this->hasMany(Emprestimo::class);
    }
}
