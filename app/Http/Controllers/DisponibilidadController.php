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
          $result = DB::select("SELECT dp.dpCodigo, dp.dpNombre,  dp.dpValorHora, dp.dpEstado,"
                . " cv.tvDescripcion FROM disponibilidad dp INNER JOIN clasevehiculo cv ON dp.dpTipoVehiculo = cv.tvCodigo"
                . " WHERE  dp.dpEstado <> 'INACTIVO' ");
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
            $disponibilidad= new Disponibilidad();  
            $disponibilidad->dpNombre = $data["dpNombre"];
            $disponibilidad->dpValorHora = $data["dpValorHora"];
            $disponibilidad->dpEstado = $data["dpEstado"];
            $disponibilidad->dpTipoVehiculo = $data["dpTipoVehiculo"];
            $disponibilidad->save();
            
            return JsonResponse::create(array('message' => "Disponibilidad guardada correctamente", "request" =>json_encode($disponibilidad->dpCodigo)), 200);
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
    public function update(Request $request, $dpCodigo)
    {
         try{
            $data = $request->all();
            $disponibilidad = Disponibilidad::find($dpCodigo);
            $disponibilidad->dpNombre = $data["dpNombre"];
            $disponibilidad->dpValorHora = $data["dpValorHora"];
            $disponibilidad->dpEstado = $data["dpEstado"];
            $disponibilidad->dpTipoVehiculo = $data["dpTipoVehiculo"];
            $disponibilidad->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($disponibilidad->dpCodigo)), 200);
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
    
     public function updateEstado(Request $request, $dpCodigo){
        try {
            $data = $request->all();
            $disponibilidad = Disponibilidad::find($dpCodigo);
            $disponibilidad->dpEstado = $data['dpEstado'];
            $disponibilidad->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($dpCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar la Disponibilidad", "exception"=>$ex->getMessage(), "request" =>json_encode($dpCodigo)), 401);
        }
    }
    
}
