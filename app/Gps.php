<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Gps extends Model
{
    protected $table = "gps";   
    protected $primaryKey = 'IdGps';
    public $timestamps = false;
}
