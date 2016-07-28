<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServicioClaseVehiculo extends Model
{
    protected $table = "servicio_clasevehiculo";   
    protected $primaryKey = 'scvId';
    public $timestamps = false;
}
