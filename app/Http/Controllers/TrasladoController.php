<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use DB;
use App\Traslado;

class TrasladoController extends Controller
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
        $result = DB::select("SELECT t.tlCodigo, t.tlNombre, t.tlValor,t.tlEstado, c.tvDescripcion, m.muNombre "
                . "  FROM traslados t INNER JOIN clasevehiculo c ON t.tlTipoVehiculo=c.tvCodigo "
                . " INNER JOIN municipio m ON t.tlCiudadOrigen=m.muCodigo WHERE t.tlPlantilla= $idPlantilla");
        return $result; 
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
            $traslado= new Traslado();                        
            $traslado->tlNombre = $data["tlNombre"];
            $traslado->tlTipoVehiculo = $data["tlTipoVehiculo"];
            $traslado->tlValor = $data["tlValor"];
            $traslado->tlCiudadOrigen = $data["tlCiudadOrigen"];
            $traslado->tlCiudadDestio = $data["tlCiudadDestio"];
            $traslado->tlEstado = $data["tlEstado"];
            $traslado->tlPlantilla = $data["tlPlantilla"];
            
            $traslado->save();
            
             if ($request->hasFile('imagen')) {
                $request->file('imagen')->move("../image/",$data["tlCodigo"].'.jpg');    
            }
            return JsonResponse::create(array('message' => "Traslado guardada correctamente", "request" =>json_encode($traslado->tlCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $tlCodigo)
    {
        try{
            $data = $request->all();
            $traslado= Traslado::find($tlCodigo);
            $traslado->tlNombre = $data["tlNombre"];
            $traslado->tlTipoVehiculo = $data["tlTipoVehiculo"];
            $traslado->tlValor = $data["tlValor"];
            $traslado->tlCiudadOrigen = $data["tlCiudadOrigen"];
            $traslado->tlCiudadDestio = $data["tlCiudadDestio"];
            $traslado->tlEstado = $data["tlEstado"];
            $traslado->tlPlantilla = $data["tlPlantilla"];
            
            $traslado->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($traslado->tlCodigo)), 200);
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
    
    
    public function updateEstado(Request $request, $tlCodigo){
        try {
            $data = $request->all();
            $traslado = Traslado::find($tlCodigo);
            $traslado->tlEstado = $data['tlEstado'];
            $traslado->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($tlCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
