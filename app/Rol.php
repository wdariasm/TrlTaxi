<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = "rol";   
    protected $primaryKey = 'IdRol';
    public $timestamps = false;
}
