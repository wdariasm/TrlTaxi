<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContratoTipoServicio extends Model
{
    protected $table = "contratotiposervicio";   
    protected $primaryKey = 'csCodigo';
    public $timestamps = false;
}
