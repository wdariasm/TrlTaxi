<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transfert extends Model
{
    protected $table = "transfert";   
    protected $primaryKey = 'tfCodigo';
    public $timestamps = false;
}
