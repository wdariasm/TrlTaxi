<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleMantenimiento extends Model
{
    protected $table = "detallemantenimiento";   
    protected $primaryKey = 'detCodigo';
    public $timestamps = false;
}
