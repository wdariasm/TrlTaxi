<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoMantenimiento extends Model
{
    protected $table = "tipomantenimiento";   
    protected $primaryKey = 'tmCodigo';
    public $timestamps = false;
}
