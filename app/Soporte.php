<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Soporte extends Model
{
    protected $table = "soporte";   
    protected $primaryKey = 'IdSoporte';
    public $timestamps = false;
}
