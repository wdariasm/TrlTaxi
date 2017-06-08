<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Parada;

class ParadaController extends Controller
{
   
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
            $insert = new Parada();
            $insert->prServicio = $data['prServicio'];
            $insert->prDireccion = $$data['prDireccion'];
            $insert->prLatiud = $$data['prLatiud'];
            $insert->prLongitud = $$data['prLongitud'];
            $insert->prValor = $$data['prValor'];
            $insert->prValorCliente = $$data['prValorCliente'];
            $insert->prFecha = $$data['prFecha'];            
            $insert->prEstado = 'ACTIVA';
            $insert->save();
            
            return JsonResponse::create(array('message' => "Para guardada correctamente", "request" =>json_encode($insert->IdParada)), 200);
            
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
            Parada::where('IdParada', $id)->update(['prEstado' => 'CANCELADA']);                              
            return JsonResponse::create(array('message' => "Contacto Eliminado Correctamente", "request" =>json_encode($insert->scIdContacto)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
