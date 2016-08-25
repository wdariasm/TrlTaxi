<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Parametro;
use Illuminate\Http\JsonResponse;


class ParametroController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
        
    }

  
  

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
       try{  
            $data = $request->all(); 
            $param = Parametro::find($id);
            $param->parCedula = $data["parCedula"];   
            $param->parEmpresa = $data["parEmpresa"];
            $param->parCiudad = $data["parCiudad"];
            $param->parFirma = $data["parFirma"];            
            $param->parConsecutivo = $data["parConsecutivo"];
            $param->parFormato = $data["parFormato"];
            $param->parTipoDoc = $data["parTipoDoc"];
            $param->parLatitud = $data["parLatitud"];
            $param->parLongitud = $data["parLongitud"];
            
            $param->save();                      
            return JsonResponse::create(array('message' => "Datos Guardados correctamente", "request" =>json_encode($param->id)), 200);
        } catch (Exception $exc) {            
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($request)), 401);
        }
    }

   
}