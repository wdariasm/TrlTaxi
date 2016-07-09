<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoVehiculo extends Model
{
    protected $table = "clasevehiculo";   
    protected $primaryKey = 'tvCodigo';
    public $timestamps = false;
}
