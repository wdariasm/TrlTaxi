<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TipoMantenimiento;
use Illuminate\Http\JsonResponse;

class TipoMantenimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return TipoMantenimiento::where('tmEstado','<>','BORRADO')
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
            $tipomantenimiento= new TipoMantenimiento();                        
            $tipomantenimiento->tmDescripcion = $data["tmDescripcion"];
            $tipomantenimiento->tmEstado = $data["tmEstado"];          
            $tipomantenimiento->save();
            
            return JsonResponse::create(array('message' => "Tipo de mantenimineto  guardado correctamente", "request" =>json_encode($tipomantenimiento->tmCodigo)), 200);
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
    public function update(Request $request, $tmCodigo)
    {
        try{
            $data = $request->all();
            $tipomantenimiento = TipoMantenimiento::find($tmCodigo);
            $tipomantenimiento->tmDescripcion = $data["tmDescripcion"];
            $tipomantenimiento->tmEstado = $data["tmEstado"];
            
            $tipomantenimiento->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($tipomantenimiento->tmCodigo)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
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
    
    public function updateEstado(Request $request, $tmCodigo){
        try {
            $data = $request->all();
            $marca = TipoMantenimiento::find($tmCodigo);
            $marca->tmEstado = $data['tmEstado'];
            $marca->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($tmCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($tmCodigo)), 401);
        }
    }
}
