<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LicenciaConduccion extends Model
{
    protected $table = "licenciaconduccion";   
    protected $primaryKey = 'IdLicencia';
    public $timestamps = false;
}
