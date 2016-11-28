<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Escolaridad;
use Illuminate\Http\JsonResponse;
use DB;
class EscolaridadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      // return Escolaridad::all();
         $resul = DB::select("Select * from escolaridad where  esEstado<>'BORRADO' ");
        return $resul;
        
        
    }
    
    public function validarCodigo($esCodigo){
        return Escolaridad::where("esCodigo",$esCodigo)->select("esCodigo")->first();
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
            $escolaridad= new Escolaridad();  
            $escolaridad->esCodigo=$data["esCodigo"];
            $escolaridad->esDescripcion = $data["esDescripcion"];
            $escolaridad->esEstado = $data["esEstado"];                     
            $escolaridad->save();
            
            return JsonResponse::create(array('message' => "Escolaridad guardada correctamente", "request" =>json_encode($escolaridad->esCodigo)), 200);
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
    public function update(Request $request, $esCodigo)
    {
        try{
            $data = $request->all();
            $escolaridad = Escolaridad::find($esCodigo);
            $escolaridad->esDescripcion = $data["esDescripcion"];
            $escolaridad->esEstado = $data["esEstado"];
            $escolaridad->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($escolaridad->esCodigo)), 200);
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
    
    public function updateEstado(Request $request, $esCodigo){
        try {
            $data = $request->all();
            $escolaridad = Escolaridad::find($esCodigo);
            $escolaridad->esEstado = $data['esEstado'];
            $escolaridad->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($esCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
