<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContratoPlantilla extends Model
{
    protected $table = "contratoplantilla";   
    protected $primaryKey = 'pcCodigo';
    public $timestamps = false;
}
