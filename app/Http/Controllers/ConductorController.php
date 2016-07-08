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
        return Conductor::all();
    }

   public function validarEmail($email){
       return Conductor::where("Email",$email)->select("Email")->first();
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
            $conductor->FechaNacimiento = $data["FechaNacimiento"]; 
            $conductor->FechaIngreso = $data["FechaIngreso"]; 
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
    public function update(Request $request, $id)
    {
       
        try{
            $data = $request->all();
            $conductor = Conductor::find($idIdConductor);
            $conductor->Nombre = $data["nombre"];
            $conductor->Direccion = $data["direccion"];
            $conductor->Telefono = $data["telefono"];
            $conductor->Email = $data["email"];
            $conductor->latitud = $data["latitud"];
                $conductor->longitud = $data["longitud"];
                $conductor->DireccionOP = $data["direccionOp"];
                $conductor->dir0 = $data["dir0"];
                $conductor->dir1 = $data["dir1"];
                $conductor->dir2 = $data["dir2"];
                $conductor->dir3 = $data["dir3"];
                $conductor->dir4 = $data["dir4"];
                $conductor->dir5 = $data["dir5"];
            
            $conductor->save();
            return JsonResponse::create(array('message' => "Conductor Actualizado Correctamente", "request" =>json_encode($conductor->IdConductor)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->message)), 401);
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
}
