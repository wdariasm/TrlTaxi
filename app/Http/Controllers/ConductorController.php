<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Conductor;
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
            $conductor->Escolaridad = $data["Escolaridad"]; 
            $conductor->FechaIngreso = $data["FechaIngreso"]; 
            $conductor->Estado = $data["Estado"]; 
            $conductor->Clave = $data["Clave"]; 
            $conductor->TipoDocumento = $data["TipoDocumento"]; 
            $conductor->NumeroCuenta = $data["NumeroCuenta"]; 
            $conductor->CdPlaca = $data["CdPlaca"]; 
            $conductor->Observacion = $data["Observacion"]; 
            
            $conductor->save();
            
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
        //
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
