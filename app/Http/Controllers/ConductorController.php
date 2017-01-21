<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Conductor;
use App\Novedad;
use Illuminate\Http\JsonResponse;
use DB;

class ConductorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()       
    {
         $result = DB::select("SELECT co.IdConductor, co.Cedula,  co.Nombre, co.TelefonoPpal, co.Direccion, co.Estado,"
                . " co.CdPlaca FROM conductor co  WHERE  co.Estado <> 'RETIRADO' ");
        return $result; 
    }

    public function validIdConductorarEmail($email){
       return Conductor::where("Email",$email)->select("Email")->first();
    }
    
    public function validarIdentificacion($Cedula){
        return Conductor::where("Cedula",$Cedula)->select("Cedula", 'Nombre', 'Email', 'IdConductor')->first();
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
            $conductor->VehiculoId = $data["VehiculoId"];
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
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    //guardarNovedad
    public function GuardarNovedad(Request $request){
        try{  
                $data = $request->all(); 
                $insert = new Novedad();
                $insert->nvConductor=$data["nvConductor"];
                $insert->nvTipo=$data["nvTipo"];
                $insert->nvDescripcion=$data["nvDescripcion"];
                $insert->nvEstado="ACTIVA";
                
                $insert->save();
            return JsonResponse::create(array('message' => "Novedad  guardada correctamente", "request" =>json_encode($insert->nvCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function guardarImagen(Request $request)
    {
        try{  
            $data = $request->all();                         
            $conductor = Conductor::find($data['IdConductor']);                        
            $conductor->RutaImg = "http://".$_SERVER['HTTP_HOST'].'/img/conductor/'.$conductor->Cedula.".jpg";
            $conductor->save();
            
            if ($request->hasFile('RutaImg')) {
                $request->file('RutaImg')->move("../img/conductor", $conductor->Cedula.".jpg");
            }
                        
            return JsonResponse::create(array('message' => "Imagen guardada correctamente", "request" =>json_encode($conductor->IdConductor)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    /**
     * Display the specified resource.
     *
     * @coram  int  $IdConductor
     * @return \Illuminate\Http\Response
     */
    public function show($IdConductor)
    {
        return Conductor::find($IdConductor);
    }
    
    public function getConVehiculo ($id){
        return DB::select ("SELECT c.Nombre, c.TelefonoPpal, c.TelefonoTres, c.Email, v.Placa, v.Movil, v.Marca, c.RutaImg 
                FROM conductor AS c INNER JOIN vehiculo  AS v ON c.VehiculoId =  v.IdVehiculo
                WHERE c.IdConductor =$id LIMIT 1");
    }

    /**
     * Update the specified resource in storage.
     *
     * @coram  \Illuminate\Http\Request  $request
     * @coram  int  $idIdConductor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $IdConductor)
    {
       
        try{
            $data = $request->all();
            $conductor = Conductor::find($IdConductor);
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
            $conductor->VehiculoId = $data["VehiculoId"];
            $conductor->save();
            
            return JsonResponse::create(array('message' => "Conductor Actualizado Correctamente", "request" =>json_encode($conductor->IdConductor)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
        
    }

   //Actualizar Novedad
    public function updateNovedad(Request $request, $nvCodigo){
       try{
            $data = $request->all();
            $novedad = Novedad::find($nvCodigo);
            $novedad->nvDescripcion = $data["nvDescripcion"]; 
            $novedad->nvTipo = $data["nvTipo"]; 
            $novedad->nvEstado= $data["nvEstado"]; 
            $novedad->save();
            
            return JsonResponse::create(array('message' => " Novedad Actualizada Correctamente", "request" =>json_encode($novedad->nvCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @coram  int  $idIdConductor
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
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }         
    
}
