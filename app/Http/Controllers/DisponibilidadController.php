<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Disponibilidad;
use Illuminate\Http\JsonResponse;
use DB;


class DisponibilidadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         return null;
    }
    
    public function getByPlanitlla($idPlantilla){
        $result = DB::select("SELECT dp.dpCodigo, dp.dpNombre,  dp.dpValorHora, dp.dpEstado, dp.dpValorCliente, "
                . " cv.tvDescripcion FROM disponibilidad dp INNER JOIN clasevehiculo cv ON dp.dpTipoVehiculo = cv.tvCodigo"
                . " WHERE  dp.dpEstado <> 'INACTIVO' AND dpPlantilla = $idPlantilla");
        return $result; 
    }
    
    public function getDisponiblidad($idPlantilla, $tipoVehiculo){
        return Disponibilidad::where("dpPlantilla", $idPlantilla)->where("dpTipoVehiculo",$tipoVehiculo)
                ->where("dpEstado", 'ACTIVO')->first();
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
            $disponibilidad= new Disponibilidad();  
            $disponibilidad->dpNombre = $data["dpNombre"];
            $disponibilidad->dpValorHora = $data["dpValorHora"];
            $disponibilidad->dpValorCliente = $data["dpValorCliente"];
            $disponibilidad->dpEstado = $data["dpEstado"];
            $disponibilidad->dpTipoVehiculo = $data["dpTipoVehiculo"];
            $disponibilidad->dpPlantilla = $data["dpPlantilla"];
            $disponibilidad->save();
            
            return JsonResponse::create(array('message' => "Disponibilidad guardada correctamente", "request" =>json_encode($disponibilidad->dpCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
  
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $dpCodigo)
    {
         try{
            $data = $request->all();
            $disponibilidad = Disponibilidad::find($dpCodigo);
            $disponibilidad->dpNombre = $data["dpNombre"];
            $disponibilidad->dpValorHora = $data["dpValorHora"];
            $disponibilidad->dpValorCliente = $data["dpValorCliente"];
            $disponibilidad->dpEstado = $data["dpEstado"];
            $disponibilidad->dpTipoVehiculo = $data["dpTipoVehiculo"];
            $disponibilidad->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($disponibilidad->dpCodigo)), 200);
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
        //
    }
    
     public function updateEstado(Request $request, $dpCodigo){
        try {
            $data = $request->all();
            $disponibilidad = Disponibilidad::find($dpCodigo);
            $disponibilidad->dpEstado = $data['dpEstado'];
            $disponibilidad->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($dpCodigo)), 200);
       }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
}
