<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Franquicia;
use Illuminate\Http\JsonResponse;
use DB;

class FranquiciaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Franquicia::all();
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
            $franquicia= new Franquicia();                        
            $franquicia->frDescripcion = $data["frDescripcion"];
            $franquicia->frEstado = $data["frEstado"];  
            $franquicia->save();
            
            return JsonResponse::create(array('message' => "franquicia guardada correctamente", "request" =>json_encode($franquicia->frCodigo)), 200);
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
    public function update(Request $request, $frCodigo)
    {
         try{
            $data = $request->all();
            $franquicia =  Franquicia::find($frCodigo);
             $franquicia->frDescripcion = $data["frDescripcion"];
            $franquicia->frEstado = $data["frEstado"];  
            $franquicia->save();
            
            return JsonResponse::create(array('message' => "Franquicia Actualizado Correctamente", "request" =>json_encode($franquicia->frCodigo)), 200);
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
    
    
     public function updateEstado(Request $request, $frCodigo){
        try {
            $data = $request->all();
            $franquicia =  Franquicia::find($frCodigo);
            $franquicia->frEstado = $data['frEstado'];
            $franquicia->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($frCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
