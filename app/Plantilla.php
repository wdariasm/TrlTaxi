<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plantilla extends Model
{
    protected $table = "plantilla";   
    protected $primaryKey = 'plCodigo';
    public $timestamps = false;
}
