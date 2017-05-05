<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServicioContactos extends Model
{
    protected $table = "serviciocontactos";   
    protected $primaryKey = 'scIdContacto';
    public $timestamps = false;
}
