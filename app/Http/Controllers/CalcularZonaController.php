<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Location\Coordinate;
use Location\Polygon;
use Illuminate\Http\JsonResponse;
use DB;

class CalcularZonaController extends Controller
{
    public function getZonaByPunto($latitud, $longitud) {                       
        $punto = new Coordinate($latitud, $longitud);          
        $zona = DB::select("SELECT z.znCodigo, z.znNombre,  GROUP_CONCAT(ptLatitud ,',', ptLongitud SEPARATOR ';')"
                . " AS ptArea FROM zona z INNER JOIN puntos p ON z.znCodigo = p.ptZona  WHERE z.znEstado='ACTIVO' GROUP BY z.znCodigo");        
        $result = 0;
        for ($index = 0; $index < count($zona); $index++) {
            $ptZona = explode(";", $zona[$index]->ptArea);
            $geofence = new Polygon();
            for ($j = 0; $j < count($ptZona); $j++) {        
                $posicion = explode("," ,$ptZona[$j]);
                $geofence->addPoint(new Coordinate($posicion[0],$posicion[1]));                
            }             
            if ($geofence->contains($punto)){
                $result = $zona[$index]->znCodigo;
                break;
            }                         
        }      
       return $result;
    }
}
