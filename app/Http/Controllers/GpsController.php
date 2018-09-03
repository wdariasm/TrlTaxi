<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Gps;
use App\Vehiculo;
use DB;
use Illuminate\Http\JsonResponse;


class GpsController extends Controller
{
    
    public function show($imei)
    {
        return Gps::where("gpImei", $imei)->select("gpLatitud", "gpLongitud", "gpVehiculoId", "gpFecha")->first();
    }
    
    public function localizacion($placa, $estado){
        try {
            
            $est="";
            if ($placa != "NN"){
                $buscar = $this->buscarPlaca($placa); // Verificar Si existe la placa o Movil               
                if ($buscar === "Error"){
                    return JsonResponse::create(array('message' => "Error", "request" =>'Placa no Existe'), 200);
                }
                $vehiculo = " AND gp.gpPlaca = '$buscar' ";
            } else {                                                
            
                if ($estado === "Todos"){
                    $est = " AND c.Disposicion <> 'EN MANTENIMIENTO'";
                } else {
                    $est = " AND c.Disposicion = '$estado'";
                }
                $vehiculo ="";
            }
            $result = DB::select("SELECT c.IdConductor, c.Nombre, c.TelefonoPpal, c.Disposicion, v.Movil, c.CdPlaca,"
                    . " gp.gpLatitud, gp.gpLongitud, c.RutaImg, gp.gpFecha,  MINUTE(TIMEDIFF(gpFecha,  NOW())) tiempo "
                    . " FROM ((gps  gp INNER JOIN vehiculo v ON gp.gpVehiculoId = v.IdVehiculo) "
                    . " INNER JOIN conductor c ON v.IdVehiculo = c.VehiculoId)  WHERE gp.gpEstado ='ACTIVO' "
                    . " AND CURRENT_DATE() = DATE(gp.gpFecha) $vehiculo $est  HAVING tiempo < 6 ");
                                   
           return $result;
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "Error", "exception"=>$exc->getMessage()), 401);
        }   
    }
    
    
    public function store(Request $request)
    {
        try{              
            $data = $request->all();             
            $placa = $data["Placa"];
            $IdVehiculo = $data["IdVehiculo"];
            $ImeiActual = $data["ImeiActual"];
            $ImeiNuevo = $data["ImeiNuevo"];            
            
            if ($ImeiActual !==""){
                DB::update("UPDATE gps SET gpEstado = 'INACTIVO' WHERE gpVehiculoId = $IdVehiculo ");
            }
            
            $smartphone = Gps::where("gpImei", $ImeiNuevo)->first();            
            if (empty($smartphone)){                
                $smart = new Gps();                
                $smart->gpImei = $ImeiNuevo;                
                $smart->gpLatitud = '0';
                $smart->gpLongitud = '0';
                $smart->gpEstado = 'ACTIVO';
                $smart->gpVehiculoId = $IdVehiculo;
                $smart->gpKey = '0';                
                $smart->gpFecha = '0000-00-00';
                $smart->gpPlaca = $placa;
                $smart->save();
                return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Guardado Correctamente"), 200);
            } else {
                $smartphone->gpPlaca = $placa;
                $smartphone->gpVehiculoId = $IdVehiculo;                
                $smartphone->gpEstado = 'ACTIVO';
                $smartphone->gpFecha = date("Y-m-d H:i:s");
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
            $gps = Gps::where('gpImei', $imei)->first();            
            $gps->gpKey = $key;
            $gps->save();
            return JsonResponse::create(array('message' => "Correcto", "request" =>"Key Actualizado Correctamente"), 200);
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
                                                
            DB::update("UPDATE gps SET gpLongitud = '".$longitud."' , gpLatitud = '".$latitud."', gpFecha = NOW()  WHERE gpImei = $imei ");    
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>"Posicion actualizada correctamente"), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }   
    }
    
    
    private function buscarPlaca($placa){
        try{
            $result = Vehiculo::select('Placa')->where('Placa',$placa)->orWhere('Movil',$placa)->first();
            if($result){
                return $result->Placa;
            }
            return "Error";
        }catch (Exception $exc) {
            return JsonResponse::create(array('message' => "Error al Buscar", 'error'=>$exc), 401);
        }
    }
        
}
