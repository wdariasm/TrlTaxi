<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    protected $table = "mantenimiento";   
    protected $primaryKey = 'IdMantenimiento';
    public $timestamps = false;
}
