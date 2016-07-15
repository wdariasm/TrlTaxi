<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\NovedadVehiculo;
use Illuminate\Http\JsonResponse;

class NovedadController extends Controller
{
    
    public function index()
    {
        
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
            $novedad= new NovedadVehiculo();                        
            $novedad->Vehiculo = $data["Vehiculo"];
            $novedad->Codigo = $data["Codigo"]; 
            $date1 = new \DateTime( str_replace("/", "-",  $data["FechaExpedicion"]));
            $novedad->FechaExpedicion =  $date1->format('Y-m-d H:i:s');        
            $novedad->Entidad = $data["Entidad"]; 
            $novedad->Entidad = $data["Entidad"]; 
            $novedad->ModServicio = $data["ModServicio"]; 
            $novedad->RadioAccion = $data["RadioAccion"]; 
            $novedad->Estado = $data["Estado"]; 
            $novedad->Tipo = $data["Tipo"]; 
            $date = new \DateTime(str_replace("/", "-",  $data["FechaInicioVigencia"]));
            $novedad->FechaInicioVigencia = $date->format('Y-m-d H:i:s');            
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaVencimiento"]));            
            $novedad->FechaVencimiento = $date2->format('Y-m-d H:i:s');

            $novedad->save();
            
            return JsonResponse::create(array('message' => "Novedad guardada correctamente", "request" =>json_encode($novedad->IdNovedad)), 200);
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
        return NovedadVehiculo::find($id);
    }
    
    public function GetNovedadByVehiculo($id){
        return NovedadVehiculo::where("Vehiculo",$id)->get();
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
            $novedad = NovedadVehiculo::find($id);            
            $novedad->Codigo = $data["Codigo"]; 
            $date1 = new \DateTime($data["FechaExpedicion"]);
            $novedad->FechaExpedicion =  $date1->format('Y-m-d H:i:s');                    
            $novedad->Entidad = $data["Entidad"]; 
            $novedad->ModServicio = $data["ModServicio"]; 
            $novedad->RadioAccion = $data["RadioAccion"]; 
            $novedad->Estado = $data["Estado"]; 
            $novedad->Tipo = $data["Tipo"]; 
            $date = new \DateTime($data["FechaInicioVigencia"]);
            $novedad->FechaInicioVigencia = $date->format('Y-m-d H:i:s');            
            $date2 = new \DateTime($data["FechaVencimiento"]);            
            $novedad->FechaVencimiento = $date2->format('Y-m-d H:i:s');
            $novedad->save();

            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($novedad->IdNovedad)), 200);
        } catch (Exception $exc) {
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
        
    }
}
