<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = "usuario";   
    protected $primaryKey = 'IdUsuario';
    public $timestamps = false;
}
