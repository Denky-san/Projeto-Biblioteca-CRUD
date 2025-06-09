<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'email', 'numero_cadastro'];

    public function emprestimos()
    {
        return $this->hasMany(Emprestimo::class);
    }
}
