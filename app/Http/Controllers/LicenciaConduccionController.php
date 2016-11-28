<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\LicenciaConduccion;
use Illuminate\Http\JsonResponse;
use DB;

class LicenciaConduccionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return LicenciaConduccion::all();
    }

    
     public function GetLicencia($id){
        $result = DB::select("SELECT li.IdLicencia, li.Numero, li.OTLicencia, li.FechaExpedicion, li.FechaVencimiento, li.Estado,"
                . " li.Categoria, co.Cedula FROM licenciaconduccion li INNER JOIN conductor co ON li.lcConductor = co.IdConductor"
                . " WHERE  li.lcConductor = $id ");
        
        return $result;  
        
    }
    
    public function validarNumero($Numero){
        return LicenciaConduccion::where("Numero",$Numero)->select("Numero")->first();
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
            $licencia= new LicenciaConduccion();                        
            $licencia->Numero = $data["Numero"];
            $licencia->OTLicencia = $data["OTLicencia"];  
            $date = new \DateTime(str_replace("/", "-", $data["FechaExpedicion"]));
            $licencia->FechaExpedicion = $date->format('Y-m-d H:i:s');
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaVencimiento"]));            
            $licencia->FechaVencimiento= $date2->format('Y-m-d H:i:s');
            $licencia->Categoria = $data["Categoria"];
            $licencia->lcConductor = $data["lcConductor"];

            $licencia->save();
            
            return JsonResponse::create(array('message' => "licencia guardada correctamente", "request" =>json_encode($licencia->IdLicencia)), 200);
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
    public function update(Request $request, $IdLicencia)
    {
        try{
            $data = $request->all();
            $licencia =  LicenciaConduccion::find($IdLicencia);
             $licencia->Numero = $data["Numero"];
            $licencia->OTLicencia = $data["OTLicencia"];  
            $date = new \DateTime(str_replace("/", "-", $data["FechaExpedicion"]));
            $licencia->FechaExpedicion = $date->format('Y-m-d H:i:s');
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaVencimiento"]));            
            $licencia->FechaVencimiento= $date2->format('Y-m-d H:i:s');
            $licencia->Categoria = $data["Categoria"];
            $licencia->lcConductor = $data["lcConductor"];
            $licencia->save();
            
            return JsonResponse::create(array('message' => "Licencia Actualizado Correctamente", "request" =>json_encode($licencia->IdLicencia)), 200);
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
    
    
     //Actualiza el estado (Funcion eliminar)
    public function updateEstado(Request $request, $IdLicencia){
        try {
            $data = $request->all();
            $licencia =  LicenciaConduccion::find($IdLicencia);
            $licencia->Estado = $data['Estado'];
            $licencia->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($IdLicencia)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function calcularFechaVencimiento(Request $request, $IdLicencia){
        try{
            $data =$request->all();
            $timeActual= time();
            $fechaVencimiento=$FechaVencimiento;
            $fecha=  strtotime($fechaVencimiento)- strtotime($timeActual);
            $diferencia=  intval($fecha/60/60/24);
            if($fecha!=$fechaVencimiento){
                
            }
            
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($IdLicencia)), 200);
  
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
