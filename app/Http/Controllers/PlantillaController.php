<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Plantilla;
use Illuminate\Http\JsonResponse;

class PlantillaController extends Controller
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
        try{  
            $data = $request->all(); 
            $plantilla= new Plantilla();                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = 'ACTIVO';
            $plantilla->plTipoServicio = $data["plTipoServicio"];            
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla guardada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    
    /*
     * Obtener todad las plantillas por tipo de servicio
     */
    public function getPlantillaporTipo($id){
        return Plantilla::where('plTipoServicio',$id)->get();
    }
    

    /**
     * Muestra todas las plantillas activas  por tipo de servicio 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Plantilla::where('plTipoServicio',$id)->where('plEstado','=','ACTIVO')
                ->select('plCodigo', 'plDescripcion')->get();
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
            $plantilla= Plantilla::find($id);                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = $data["plEstado"];
            $plantilla->plTipoServicio = $data["plTipoServicio"];            
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
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
        try{            
            $plantilla= Plantilla::find($id);                                    
            $plantilla->plEstado = 'INACTIVO';                    
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla inactivada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
}
