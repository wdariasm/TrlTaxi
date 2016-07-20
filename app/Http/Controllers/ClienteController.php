<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Cliente;
class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         return Cliente::where('Estado','<>','INACTIVO')
                ->get();
    }

    
     public function validarIdentificacion($Cedula){
        return Cliente::where("Identificacion",$Cedula)->select("Identificacion")->first();
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
            $cliente= new Cliente();                        
            $cliente->Identificacion = $data["Identificacion"];
            $cliente->Nombres = $data["Nombres"]; 
            $cliente->Direccion = $data["Direccion"]; 
            $cliente->MovilPpal = $data["MovilPpal"]; 
            $cliente->MovilDos = $data["MovilDos"]; 
            $cliente->MovilTres = $data["MovilTres"]; 
            $cliente->Correo = $data["Correo"]; 
            $cliente->Estado = $data["Estado"]; 
            $cliente->DigitoVerificacion = $data["DigitoVerificacion"]; 
            $cliente->TipoDocumento = $data["TipoDocumento"]; 
            
            $cliente->save();
            
          return JsonResponse::create(array('message' => "Cliente  guardado correctamente", "request" =>json_encode($cliente->IdCliente)), 200);
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
    public function update(Request $request, $IdCliente)
    {
         try{
            $data = $request->all();
            $cliente = Cliente::find($IdCliente);
            $cliente->Nombres = $data["Nombres"]; 
            $cliente->Direccion = $data["Direccion"]; 
            $cliente->MovilPpal = $data["MovilPpal"]; 
            $cliente->MovilDos = $data["MovilDos"]; 
            $cliente->MovilTres = $data["MovilTres"]; 
            $cliente->Correo = $data["Correo"]; 
            $cliente->Estado = $data["Estado"]; 
            $cliente->DigitoVerificacion = $data["DigitoVerificacion"]; 
            $cliente->TipoDocumento = $data["TipoDocumento"];  
            $cliente->save();
            return JsonResponse::create(array('message' => "Cliente Actualizado Correctamente", "request" =>json_encode($cliente->IdCliente)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->message)), 401);
        }
    }

       //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $IdCliente){
        try {
            $data = $request->all();
            $cliente = Cliente::find($IdCliente);
            $cliente->Estado = $data['Estado'];
            $cliente->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($IdCliente)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($IdCliente)), 401);
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
