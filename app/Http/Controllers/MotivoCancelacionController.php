<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\MotivoCancelacion;
use Illuminate\Http\JsonResponse;

class MotivoCancelacionController extends Controller
{
    public function index(){
        return MotivoCancelacion::all();
    }
    
    public function store(Request $request)
    {
         try{  
            $data = $request->all(); 
            $motivo= new MotivoCancelacion();                        
            $motivo->mtDescripcion = $data["mtDescripcion"];
            $motivo->mtModulo = $data["mtModulo"];
            $motivo->mtDejarServicio = $data["mtDejarServicio"];
            $motivo->mtEstado = $data["mtEstado"];          
            $motivo->save();
            
            return JsonResponse::create(array('message' => "Datos guardados correctamente", "request" =>json_encode($motivo->IdMotivo)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
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
            $motivo = Encuesta::find($id);
            $motivo->mtDescripcion = $data["mtDescripcion"];
            $motivo->mtModulo = $data["mtModulo"];
            $motivo->mtDejarServicio = $data["mtDejarServicio"];
            $motivo->mtEstado = $data["mtEstado"];            
            $motivo->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($motivo->ecCodigo)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }      
}
