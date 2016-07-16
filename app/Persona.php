<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
     protected $table = "persona";   
    protected $primaryKey = 'IdPersona';
    public $timestamps = false;
    
}
