<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use DB;
use App\Persona;



class PersonaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Persona::all();
    }
    
    public function validarIdentificacion($Cedula){
        return Persona::where("Cedula",$Cedula)->select("Cedula", "Nombre", "Correo", "IdPersona")->first();
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
            $persona= new Persona();
            
            $persona->Cedula = $data["Cedula"];
            $persona->Nombre = $data["Nombre"];   
            $persona->Direccion = $data["Direccion"];
            $persona->MovilPpal = $data["MovilPpal"];
            $persona->Direccion = $data["Direccion"];
            $persona->MovilDos =  $data["MovilDos"];
            $persona->Correo = $data["Correo"];
            $persona->Estado = $data["Estado"];
            $persona->TipoDocumento = $data["TipoDocumento"];           

            $persona->save();
            
            
            return JsonResponse::create(array('message' => "Guardado correctamente", "request" =>json_encode($persona->IdPersona)), 200);
        } catch (\Exception $exc) {    
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
        return Persona::find($id);
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
            $persona = Persona::find($id);
            $persona->Cedula = $data["Cedula"];
            $persona->Nombre = $data["Nombre"];   
            $persona->Direccion = $data["Direccion"];
            $persona->MovilPpal = $data["MovilPpal"];
            $persona->Direccion = $data["Direccion"];
            $persona->MovilDos =  $data["MovilDos"];
            $persona->Correo = $data["Correo"];
            $persona->Estado = $data["Estado"];
            $persona->TipoDocumento = $data["TipoDocumento"];         
            $persona->save();
                       
            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($persona->id)), 200);
        } catch (Exception $exc) {            
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($data)), 401);
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
