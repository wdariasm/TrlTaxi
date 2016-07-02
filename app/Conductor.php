<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = "conductor";   
    protected $primaryKey = 'IdConductor';
    public $timestamps = false;
}
