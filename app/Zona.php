<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Zona extends Model
{
    protected $table = "zona";   
    protected $primaryKey = 'znCodigo';
    public $timestamps = false;
}
