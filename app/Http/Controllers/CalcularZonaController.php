<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

class CalcularZonaController extends Controller
{
    public function getZonaByPunto($latitud, $longitud) {                               
        $result= DB::select("SELECT znCodigo,znNombre FROM zona WHERE contains(znArea, POINT($latitud, $longitud)) LIMIT 1");           
        if(!empty($result)){
            return $result[0]->znCodigo;
        }        
        return 0;
    }
}
