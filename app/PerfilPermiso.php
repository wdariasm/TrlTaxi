<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PerfilPermiso extends Model
{
     protected $table = "rolpermiso";   
    protected $primaryKey = 'Id';
    public $timestamps = false;
}
