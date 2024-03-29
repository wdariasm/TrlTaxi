<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Marca;
use Illuminate\Http\JsonResponse;

class MarcaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
     // return Marca::all();
        return Marca::where('maEstado','<>','BORRADO')
                ->get();
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
            $marca= new Marca();                        
            $marca->maDescripcion = $data["maDescripcion"];
            $marca->maEstado = $data["maEstado"];                     
            $marca->save();
            
            return JsonResponse::create(array('message' => "Marca guardada correctamente", "request" =>json_encode($marca->maCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $maCodigo
     * @return \Illuminate\Http\Response
     */
    public function show($maCodigo)
    {
        //
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $maCodigo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $maCodigo)
    {
         try{
            $data = $request->all();
            $marca = Marca::find($maCodigo);
            $marca->maDescripcion = $data["maDescripcion"];
            $marca->maEstado = $data["maEstado"];
            $marca->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($marca->maCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }  
    
    
    //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $maCodigo){
        try {
            $data = $request->all();
            $marca = Marca::find($maCodigo);
            $marca->maEstado = $data['maEstado'];
            $marca->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($maCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}
