<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MotivoCancelacion extends Model
{
    protected $table = "motivocancelacion";   
    protected $primaryKey = 'IdMotivo';
    public $timestamps = false;
}
