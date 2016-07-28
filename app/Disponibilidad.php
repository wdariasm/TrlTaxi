<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Disponibilidad extends Model
{
    protected $table = "disponibilidad";   
    protected $primaryKey = 'dpCodigo';
    public $timestamps = false;
}
