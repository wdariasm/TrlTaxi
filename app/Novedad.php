<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Novedad extends Model
{
    protected $table = "novedad";   
    protected $primaryKey = 'nvCodigo';
    public $timestamps = false;
}
