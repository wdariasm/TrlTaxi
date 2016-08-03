<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Franquicia extends Model
{
    protected $table = "franquicias";   
    protected $primaryKey = 'frCodigo';
    public $timestamps = false;
}
