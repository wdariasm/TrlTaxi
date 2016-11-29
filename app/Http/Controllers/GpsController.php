<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Gps;
use DB;
use Illuminate\Http\JsonResponse;


class GpsController extends Controller
{
    public function store(Request $request)
    {
        try{              
            $data = $request->all();             
            $placa = $data["placa"];
            $IdVehiculo = $data["placa"];
            $ImeiActual = $data["imeiActual"];
            $ImeiNuevo = $data["imeiNuevo"];            
            
            if ($ImeiActual !==""){
                DB::update("UPDATE gps SET Estado = 'INACTIVO' WHERE gpVehiculo = $IdVehiculo ");
            }
            
            $smartphone = Gps::find($ImeiNuevo);            
            if (empty($smartphone)){                
                $smart = new Gps();                
                $smart->gpImei = $ImeiNuevo;                
                $smart->gpLatitud = '0';
                $smart->gpLongitud = '0';
                $smart->gpEstado = 'ACTIVO';
                $smart->gpVehiculoId = $placa;
                $smart->gpKey = '0';                
                $smart->gpFecha = '0000-00-00';
                $smart->gpPlaca = $placa;
                $smart->save();
                return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Guardado Correctamente"), 200);
            } else {
                $smartphone->gpPlaca = $placa;
                $smartphone->gpVehiculoId = $IdVehiculo;                
                $smartphone->Estado = 'ACTIVO';
                $smartphone->save();
                return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Actualizado Correctamente"), 200);
            }            
            return JsonResponse::create(array('message' => "Error", "request" =>"Error al Guardar IMEI"), 200);
                                    
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    /*actualizar key de notificacion*/
    public function update(Request $request, $imei)
    {
       try{            
            $key = $request->get("gpKey");           
            $gps = Gps::find($imei);
            $gps->gpKey = $key;
            $gps->save();
            return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Actualizado Correctamente"), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }             
    }
    
    /* actualizar posicion */
    public function setPosicion(Request $request, $imei)
    {
        try{
                       
            $latitud = $request->get("gpLatitud");
            $longitud = $request->get("gpLongitud");
                                                
            DB::update("UPDATE gps SET gpLongitud = '".$longitud."' , gpLatitud = '".$latitud."'  WHERE gpImei = $imei ");    
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>"Posicion actualizada correctamente"), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }   
    }
}
