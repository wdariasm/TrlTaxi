<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = "servicio";   
    protected $primaryKey = 'IdServicio';
    public $timestamps = false;
}
