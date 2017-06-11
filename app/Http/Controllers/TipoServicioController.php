<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TipoServicio;
use Illuminate\Http\JsonResponse;
use DB;
use App\ServicioClaseVehiculo;

class TipoServicioController extends Controller
{
      
    public function index()
    {
        $servicio = DB::select("SELECT s.svDescripcion, s.svEstado, s.svCodigo, GROUP_CONCAT(sc.scvClaseVehiculo) AS TipoVehiculo, s.svValorParada "
                . " FROM  tiposervicio s LEFT JOIN servicio_clasevehiculo sc ON s.svCodigo = sc.scvServicio AND sc.scvEstado ='ACTIVO' "
                . " WHERE s.svEstado <> 'BORRADO' GROUP BY s.svCodigo");
        return $servicio;
    }
    
    public function getActivos(){
        return TipoServicio::where('svEstado','ACTIVO')->select('svCodigo', 'svDescripcion', 'svPlantilla', 'svValorParada', 'svCampo')->get();
    }
    

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
            $servicio= new TipoServicio();                        
            $servicio->svDescripcion = $data["svDescripcion"];
            $servicio->svEstado = $data["svEstado"];
            $servicio->svValorParada = $data["svValorParada"];            
            $servicio->save();
            $tipos = $data["TipoVehiculo"];             
            for ($index = 0; $index < count($tipos); $index++) {
                $insert = new ServicioClaseVehiculo();
                $insert->scvServicio =$servicio->svCodigo;
                $insert->scvClaseVehiculo = $tipos[$index];
                $insert->scvEstado ='ACTIVO';
                $insert->save();
            }      
            
            return JsonResponse::create(array('message' => "TipoServicio guardado correctamente", "request" =>json_encode($servicio->svCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
   
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $svCodigo)
    {
       try{
            $data = $request->all();
            $servicio = TipoServicio::find($svCodigo);
            $servicio->svDescripcion = $data["svDescripcion"];
            $servicio->svEstado = $data["svEstado"];
            $servicio->svValorParada = $data["svValorParada"];
            $servicio->save();
            
            $tipos = $data["TipoVehiculo"]; 
            DB::update("UPDATE servicio_clasevehiculo SET scvEstado ='BORRADO' WHERE scvServicio = $svCodigo");
            for ($index = 0; $index < count($tipos); $index++) {
                $insert = new ServicioClaseVehiculo();
                $insert->scvServicio =$svCodigo;
                $insert->scvClaseVehiculo = $tipos[$index];
                $insert->scvEstado ='ACTIVO';
                $insert->save();
            }                        
            
            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($servicio->svCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function destroy($svCodigo)
    {
        //
    }
    
    
    
     //Actualiza el estado (Funcion eliminar)
    public function updateEstado(Request $request, $svCodigo){
        try {
            $data = $request->all();
            $servicio = TipoServicio::find($svCodigo);
            $servicio->svEstado = $data['svEstado'];
            $servicio->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($svCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
