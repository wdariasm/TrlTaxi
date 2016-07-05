<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = "vehiculo";   
    protected $primaryKey = 'IdVehiculo';
    public $timestamps = false;
}
