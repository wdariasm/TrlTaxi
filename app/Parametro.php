<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Parametro extends Model
{
     protected $table = "parametro";   
    protected $primaryKey = 'parCodigo';
    public $timestamps = false;
}
