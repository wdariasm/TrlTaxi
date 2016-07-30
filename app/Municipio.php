<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    protected $table = "municipio";   
    protected $primaryKey = 'muCodigo';
    public $timestamps = false;
}
