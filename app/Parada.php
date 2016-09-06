<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Parada extends Model
{
    protected $table = "paradas";   
    protected $primaryKey = 'IdParada';
    public $timestamps = false;
}
