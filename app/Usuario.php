<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    protected $table = "usuario";   
    protected $primaryKey = 'IdUsuario';
    public $timestamps = false;
    protected $hidden = ['Clave', 'KeyConf'];
}
