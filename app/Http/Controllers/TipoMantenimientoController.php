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
    public function update(Request $request, $tmCodigo)
    {
        try{
            $data = $request->all();
            $tipomantenimiento = TipoMantenimiento::find($tmCodigo);
            $tipomantenimiento->tmDescripcion = $data["tmDescripcion"];
            $tipomantenimiento->tmEstado = $data["tmEstado"];
            
            $tipomantenimiento->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($tipomantenimiento->tmCodigo)), 200);
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
    
    public function updateEstado(Request $request, $tmCodigo){
        try {
            $data = $request->all();
            $marca = TipoMantenimiento::find($tmCodigo);
            $marca->tmEstado = $data['tmEstado'];
            $marca->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($tmCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
