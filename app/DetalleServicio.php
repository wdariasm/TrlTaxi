<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleServicio extends Model
{
    protected $table = "serviciodetalle";   
    protected $primaryKey = 'dtCodigo';
    public $timestamps = false;
}
