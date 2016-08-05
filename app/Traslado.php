<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Traslado extends Model
{
    
    protected $table = "traslados";   
    protected $primaryKey = 'tlCodigo';
    public $timestamps = false;
}
