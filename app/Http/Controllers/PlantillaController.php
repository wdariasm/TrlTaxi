<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Plantilla;
use App\HistorialPlantilla;
use App\Ruta;
use App\Traslado;
use App\Transfert;
use Illuminate\Http\JsonResponse;
use DB;

class PlantillaController extends Controller
{
   
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{  
            $data = $request->all(); 
            $plantilla= new Plantilla();                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = 'ACTIVO';
            $plantilla->plValorProveedor = $data["plValorProveedor"]; 
            $plantilla->plValorCliente = $data["plValorCliente"]; 
            $plantilla->plTipoServicio = $data["plTipoServicio"]; 
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla guardada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
    
    
    /*
     * Obtener todas las plantillas por tipo de servicio
     */
    public function getPlantillaporTipo($id){
        
        return Plantilla::join('tiposervicio', 'plantilla.plTipoServicio', '=', 'tiposervicio.svCodigo')                
                ->where('plTipoServicio', $id)
                ->select('plantilla.*','tiposervicio.svDescripcion')                
                ->get();                
    }
        
    /*
     * Obtener Tipos de Vehiculos por plantilla
     */
    public function getTiposVehiculo($id) {
        $result = DB::select("SELECT DISTINCT t.tfTipoVehiculo,cv.tvCodigo, cv.tvDescripcion , cv.tvNumPasajero, cv.tvRuta FROM "
            . " transfert t INNER JOIN clasevehiculo cv ON  t.tfTipoVehiculo=cv.tvCodigo WHERE tfPlantilla = $id");        
        return $result;        
    }

    public function getValoresParada($id){
        return Plantilla::select("plValorCliente", "plValorProveedor")->find($id);
    }


    /**
     * Muestra todas las plantillas activas  por tipo de servicio 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Plantilla::where('plTipoServicio',$id)->where('plEstado','=','ACTIVO')
                ->select('plCodigo', 'plDescripcion', 'plTipoServicio', 'plValorProveedor', 'plValorCliente')->get();
    }

    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{  
            $data = $request->all(); 
            $plantilla= Plantilla::find($id);                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = $data["plEstado"];
            $plantilla->plTipoServicio = $data["plTipoServicio"];
            $plantilla->plValorProveedor = $data["plValorProveedor"];
            $plantilla->plValorCliente = $data["plValorCliente"];                        
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{            
            $plantilla= Plantilla::find($id);                                    
            $plantilla->plEstado = 'INACTIVO';                    
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla inactivada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
    
    public function borrarDatos(Request $request)
    {
        try{  
            $data = $request->all(); 
            $idPlantilla =  $data["PlantillaId"];
            $usuario = $data["Usuario"];
            $tipo = $data["Tipo"];
            $datos = null;
            $descripcion = "";
            switch ($tipo) {
                case "1":                    
                    $descripcion  ="TRANSFER";
                    $datos = Transfert::where("tfPlantilla", $idPlantilla)->get();
                    $filas = Transfert::where('tfPlantilla', $idPlantilla)->delete();
                    break;                
                case "3":
                    $descripcion  ="RUTA";
                    $datos = Ruta::where("rtPlantilla", $idPlantilla)->get();
                    $filas = Ruta::where('rtPlantilla', $idPlantilla)->delete();
                    break;
                
                case "4":
                    $descripcion  ="TRASLADO";
                    $datos = Traslado::where("tlPlantilla", $idPlantilla)->get();
                    $filas = Traslado::where('tlPlantilla', $idPlantilla)->delete();
                    break;                
            }
                                    
            $historial = new HistorialPlantilla();                        
            $historial->htDescripcion = "ELINACIÓN MASIVA DE DATOS PLANTILLA ".$descripcion;
            $historial->htUsuario = $usuario;
            $historial->htDatos = $datos;
            $historial->htPlantillaId = $idPlantilla;
            $historial->htNombrePl = $data["Descripcion"];
            $historial->save();           
            return JsonResponse::create(array('message' => "Datos borrados correctamente", "request" =>json_encode($filas)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
}
