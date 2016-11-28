<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Encuesta;

class EncuestaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return Encuesta::all();
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
            $encuesta= new Encuesta();                        
            $encuesta->ecDescripcion = $data["ecDescripcion"];
            $encuesta->ecEstado = $data["ecEstado"];          
            $encuesta->save();
            
            return JsonResponse::create(array('message' => "Encuesta guardada correctamente", "request" =>json_encode($encuesta->ecCodigo)), 200);
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
    public function update(Request $request, $ecCodigo)
    {
       try{
            $data = $request->all();
            $encuesta = Encuesta::find($ecCodigo);
            $encuesta->ecDescripcion = $data["ecDescripcion"];
            $encuesta->ecEstado = $data["ecEstado"];
            
            $encuesta->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($encuesta->ecCodigo)), 200);
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
    
    public function updateEstado(Request $request, $ecCodigo){
        try {
            $data = $request->all();
            $encuesta = Encuesta::find($ecCodigo);
            $encuesta->ecEstado = $data['ecEstado'];
            $encuesta->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($ecCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
