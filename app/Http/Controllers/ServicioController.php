<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;
use Illuminate\Http\JsonResponse;
use DB;
use App\ServicioClaseVehiculo;
class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $servicio = DB::select("SELECT s.svDescripcion, s.svEstado, s.svCodigo, GROUP_CONCAT(sc.scvClaseVehiculo) AS TipoVehiculo "
                . " FROM  servicio s LEFT JOIN servicio_clasevehiculo sc ON s.svCodigo = sc.scvServicio AND sc.scvEstado ='ACTIVO' "
                . " WHERE s.svEstado <> 'BORRADO' GROUP BY s.svCodigo");
        return $servicio;
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
            $servicio= new Servicio();                        
            $servicio->svDescripcion = $data["svDescripcion"];
            $servicio->svEstado = $data["svEstado"];                     
            $servicio->save();
            $tipos = $data["TipoVehiculo"];             
            for ($index = 0; $index < count($tipos); $index++) {
                $insert = new ServicioClaseVehiculo();
                $insert->scvServicio =$servicio->svCodigo;
                $insert->scvClaseVehiculo = $tipos[$index];
                $insert->scvEstado ='ACTIVO';
                $insert->save();
            }      
            
            return JsonResponse::create(array('message' => "Servicio guardado correctamente", "request" =>json_encode($servicio->svCodigo)), 200);
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function show($svCodigo)
    {
        //
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
            $servicio = Servicio::find($svCodigo);
            $servicio->svDescripcion = $data["svDescripcion"];
            $servicio->svEstado = $data["svEstado"];
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
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
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
            $servicio = Servicio::find($svCodigo);
            $servicio->svEstado = $data['svEstado'];
            $servicio->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($svCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($svCodigo)), 401);
        }
    }
}
