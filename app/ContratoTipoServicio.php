<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContratoTipoServicio extends Model
{
    protected $table = "contratodisponibilidad";   
    protected $primaryKey = 'dcCodigo';
    public $timestamps = false;
}
