<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    protected $table = "tipodocumento";   
    protected $primaryKey = 'tdCodigo';
    public $timestamps = false;
}
