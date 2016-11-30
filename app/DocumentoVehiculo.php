<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentoVehiculo extends Model
{
    protected $table = "documentovehiculo";   
    protected $primaryKey = 'dvCodigo';
    public $timestamps = false;
}
