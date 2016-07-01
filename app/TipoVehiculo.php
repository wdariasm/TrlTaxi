<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoVehiculo extends Model
{
    protected $table = "tipovehiculo";   
    protected $primaryKey = 'tvCodigo';
    public $timestamps = false;
}
