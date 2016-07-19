<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UsuarioPermiso extends Model
{
    protected $table = "usuariopermiso";   
    protected $primaryKey = 'upCodigo';
    public $timestamps = false;
}
