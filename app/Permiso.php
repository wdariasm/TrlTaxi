<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    protected $table = "permiso";   
    protected $primaryKey = 'IdPermiso';
    public $timestamps = false;
}
