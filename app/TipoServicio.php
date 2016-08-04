<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoServicio extends Model
{
    protected $table = "tiposervicio";   
    protected $primaryKey = 'svCodigo';
    public $timestamps = false;
}
