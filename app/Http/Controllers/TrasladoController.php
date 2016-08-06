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
       $result = DB::select("SELECT r.tlCodigo, r.tlNombre, r.tlValor,r.tlEstado, c.tvDescripcion, m.muNombre,"
                . " p.plDescripcion FROM traslados r,clasevehiculo c,municipio m,plantilla p"
                . " WHERE r.tlTipoVehiculo=c.tvCodigo AND r.tlCiudadOrigen=m.muCodigo AND r.tlCiudadDestio=m.muCodigo AND r.tlPlantilla=p.plCodigo");
        return $result; 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($request)), 401);
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
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($tlCodigo)), 401);
        }
    }
}
