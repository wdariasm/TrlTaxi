<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{
    protected $table = "contrato";   
    protected $primaryKey = 'IdContrato';
    public $timestamps = false;
}
