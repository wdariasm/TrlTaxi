<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
     protected $table = "encuesta";   
    protected $primaryKey = 'ecCodigo';
    public $timestamps = false;
}
