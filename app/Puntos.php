<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Puntos extends Model
{
    protected $table = "puntos";   
    protected $primaryKey = 'ptCodigo';
    public $timestamps = false;
}
