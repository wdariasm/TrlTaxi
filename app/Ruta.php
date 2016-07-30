<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{
    protected $table = "ruta";   
    protected $primaryKey = 'rtCodigo';
    public $timestamps = false;
}
