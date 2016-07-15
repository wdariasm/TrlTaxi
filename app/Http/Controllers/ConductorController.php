<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Conductor;
use App\Novedad;
use Illuminate\Http\JsonResponse;

class ConductorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //return Conductor::all();
        
        return Conductor::where('Estado','<>','RETIRADO')
                ->get();
    }

   public function validIdConductorarEmail($email){
       return Conductor::where("Email",$email)->select("Email")->first();
    }
    
    public function validarIdentificacion($Cedula){
        return Conductor::where("Cedula",$Cedula)->select("Cedula")->first();
    }
    
     public function GetNovedadByConductor($IdConductor){
        return Novedad::where("nvConductor",$IdConductor)->get();
    }
    
    public function store(Request $request)
    {
        try{  
            $data = $request->all(); 
            $conductor= new Conductor();                        
            $conductor->Cedula = $data["Cedula"];
            $conductor->Nombre = $data["Nombre"]; 
            $conductor->Direccion = $data["Direccion"]; 
            $conductor->TelefonoPpal = $data["TelefonoPpal"]; 
            $conductor->TelefonoDos = $data["TelefonoDos"]; 
            $conductor->TelefonoTres = $data["TelefonoTres"]; 
            $conductor->Email = $data["Email"]; 
            $date = new \DateTime(str_replace("/", "-", $data["FechaNacimiento"]));
            $conductor->FechaNacimiento = $date->format('Y-m-d H:i:s');
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaIngreso"]));            
            $conductor->FechaIngreso = $date2->format('Y-m-d H:i:s');
            $conductor->Estado = $data["Estado"]; 
            $conductor->NumeroCuenta = $data["NumeroCuenta"]; 
            $conductor->CdPlaca = $data["CdPlaca"]; 
            $conductor->Observacion = $data["Observacion"]; 
            $conductor->Escolaridad = $data["Escolaridad"]; 
            $conductor->TipoDocumento = $data["TipoDocumento"]; 
            $conductor->save();
            
            $novedad = $data["Novedades"];
            foreach ($novedad as $n){
                $insert = new Novedad();
                $insert->nvConductor=$conductor->IdConductor;
                $insert->nvTipo=$n["nvTipo"];
                $insert->nvDescripcion=$n["nvDescripcion"];
                $insert->nvEstado="ACTIVA";
                
                $insert->save();
                        
            }
                
            
            
            return JsonResponse::create(array('message' => "Conductor  guardado correctamente", "request" =>json_encode($conductor->IdConductor)), 200);
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    
    public function guardarNovedad(Request $request){
        try{  
                $data = $request->all(); 
                $insert = new Novedad();
                $insert->nvConductor=$data->IdConductor;
                $insert->nvTipo=$data["nvTipo"];
                $insert->nvDescripcion=$data["nvDescripcion"];
                $insert->nvEstado="ACTIVA";
                
                $insert->save();
            return JsonResponse::create(array('message' => "Conductor  guardado correctamente", "request" =>json_encode($insert->IdConductor)), 200);
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }


        /**
     * Display the specified resource.
     *
     * @param  int  $IdConductor
     * @return \Illuminate\Http\Response
     */
    public function show($IdConductor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $IdConductor
     * @return \Illuminate\Http\Response
     */
    public function edit($IdConductor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $idIdConductor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $IdConductor)
    {
       
        try{
            $data = $request->all();
            $conductor = Conductor::find($IdConductor);
            $conductor->Nombre = $data["Nombre"]; 
            $conductor->Direccion = $data["Direccion"]; 
            $conductor->TelefonoPpal = $data["TelefonoPpal"]; 
            $conductor->TelefonoDos = $data["TelefonoDos"]; 
            $conductor->TelefonoTres = $data["TelefonoTres"]; 
            $conductor->Email = $data["Email"]; 
            $date = new \DateTime(str_replace("/", "-", $data["FechaNacimiento"]));
            $conductor->FechaNacimiento = $date->format('Y-m-d H:i:s');
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaIngreso"]));            
            $conductor->FechaIngreso = $date2->format('Y-m-d H:i:s');
            $conductor->Estado = $data["Estado"]; 
            $conductor->NumeroCuenta = $data["NumeroCuenta"]; 
            $conductor->CdPlaca = $data["CdPlaca"]; 
            $conductor->Observacion = $data["Observacion"]; 
            $conductor->Escolaridad = $data["Escolaridad"]; 
            $conductor->TipoDocumento = $data["TipoDocumento"]; 
            $conductor->save();
            
            return JsonResponse::create(array('message' => "Conductor Actualizado Correctamente", "request" =>json_encode($conductor->IdConductor)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->message)), 401);
        }
        
    }

    public function updateNovedad(){
        
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $idIdConductor
     * @return \Illuminate\Http\Response
     */
    public function destroy($idIdConductor)
    {
        //
    }
    
    
       //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $IdConductor){
        try {
            $data = $request->all();
            $conductor = Conductor::find($IdConductor);
            $conductor->Estado = $data['Estado'];
            $conductor->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($IdConductor)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($IdConductor)), 401);
        }
    }

    
   
    
    
}
