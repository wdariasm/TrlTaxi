<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\ServicioContactos;

class ContactoController extends Controller
{
    /*
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{  
            $data = $request->all(); 
            $insert = new ServicioContactos();
            $insert->scIdServicio = $data['scIdServicio'];
            $insert->scNombre = $data['scNombre'];
            $insert->scTelefono = $data['scTelefono'];
            if(isset($data['scNota'])){
                $insert->scNota = $data['scNota'];
            }                                                
            $insert->save();
                              
            return JsonResponse::create(array('message' => "Contacto Guardado Correctamente", "request" =>json_encode($insert->scIdContacto)), 200);
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
        $contactos = ServicioContactos::where('scIdServicio', $id)->where('scEstado', 'ACTIVO')->get();
        return $contactos;
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
        try{              
           $result = ServicioContactos::where('scIdContacto', $id)->update(['scEstado' => 'INACTIVO']);                              
            return JsonResponse::create(array('message' => "Contacto Guardado Correctamente", "request" =>json_encode($result)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
