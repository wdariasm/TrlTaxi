<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoVehiculo;
use Illuminate\Http\JsonResponse;

class TipoVehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         //return TipoVehiculo::all();
          return TipoVehiculo::where('tvEstado','<>','BORRADO')
                ->get();
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
            $tipoVehiculo= new TipoVehiculo();                        
            $tipoVehiculo->tvDescripcion = $data["tvDescripcion"];
            $tipoVehiculo->tvEstado = $data["tvEstado"];                     
            $tipoVehiculo->save();
            
            return JsonResponse::create(array('message' => "Tipo de vehiculo  guardado correctamente", "request" =>json_encode($tipoVehiculo->tvCodigo)), 200);
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
    public function update(Request $request, $tvCodigo)
    {
        try{
            $data = $request->all();
            $tipoVehiculo = TipoVehiculo::find($tvCodigo);
            $tipoVehiculo->tvDescripcion = $data["tvDescripcion"];
            $tipoVehiculo->tvEstado = $data["tvEstado"];
            $tipoVehiculo->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($tipoVehiculo->tvCodigo)), 200);
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
    
    
    
    //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $tvCodigo){
        try {
            $data = $request->all();
            $marca = TipoVehiculo::find($tvCodigo);
            $marca->tvEstado = $data['tvEstado'];
            $marca->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($tvCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($tvCodigo)), 401);
        }
    }
}
