<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Novedad extends Model
{
    protected $table = "novedadvehiculo";   
    protected $primaryKey = 'IdNovedad';
    public $timestamps = false;
}
