<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HistorialPlantilla extends Model
{
    protected $table = "historialplantilla";   
    protected $primaryKey = 'htIdHistorial';
    public $timestamps = false;
}
