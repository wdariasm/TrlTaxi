<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Cliente;
use DB;
class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
             $result = DB::select("SELECT co.Identificacion, co.Nombres,  co.Direccion, co.MovilPpal, co.Estado, co.DigitoVerificacion,"
                . " co.TipoPersona, co.TipoDocumento, co.Correo, es.tdDescripcion FROM clientes co INNER JOIN"
                     . "  tipodocumento es ON co.TipoDocumento = es.tdCodigo WHERE  Estado <> 'INACTIVO' ");
        return $result; 
    
        
    }
    
    public function validarIdentificacion($Cedula){
        return Cliente::where("Identificacion",$Cedula)->select("Identificacion", 'Nombres', 'IdCliente', 'Correo', 'MovilPpal')->first();
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
            $cliente->TipoPersona = $data["TipoPersona"]; 
            
            $cliente->save();
            
          return JsonResponse::create(array('message' => "Cliente  guardado correctamente", "request" =>json_encode($cliente->IdCliente)), 200);
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
        return Cliente::find($id);
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
            $cliente->TipoPersona = $data["TipoPersona"]; 
            $cliente->save();
            return JsonResponse::create(array('message' => "Cliente Actualizado Correctamente", "request" =>json_encode($cliente->IdCliente)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
    public function destroy($id)
    {
        //
    }
}
