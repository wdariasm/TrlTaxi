<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use DB;
use App\Ruta;

class RutaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       return Ruta::all();
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
            $ruta= new Ruta();                        
            $ruta->rtNombre = $data["rtNombre"];
            $ruta->rtDescripcion = $data["rtDescripcion"];
            $ruta->trTipoVehiculo = $data["trTipoVehiculo"];
            $ruta->trValor = $data["trValor"];
            $ruta->trDepartamento = $data["trDepartamento"];
            $ruta->trCiudad = $data["trCiudad"];
            $ruta->trEstado = $data["trEstado"];
            $ruta->trImagen = "http://".$_SERVER['HTTP_HOST'].'/image/'.$data["rtCodigo"].".jpg";
            $ruta->save();
            
             if ($request->hasFile('imagen')) {
                $request->file('imagen')->move("../image/",$data["rtCodigo"].'.jpg');    
            }
            return JsonResponse::create(array('message' => "Ruta guardada correctamente", "request" =>json_encode($ruta->rtCodigo)), 200);
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
    public function update(Request $request, $rtCodigo)
    {
          try{
            $data = $request->all();
            $ruta= Ruta::find($rtCodigo);
            $ruta->rtNombre = $data["rtNombre"];
            $ruta->rtDescripcion = $data["rtDescripcion"];
            $ruta->trTipoVehiculo = $data["trTipoVehiculo"];
            $ruta->trValor = $data["trValor"];
            $ruta->trDepartamento = $data["trDepartamento"];
            $ruta->trCiudad = $data["trCiudad"];
            $ruta->trEstado = $data["trEstado"];
            $ruta->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($ruta->rtCodigo)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($request)), 401);
        }
    }
    
    public function updateImage(Request $request){        
        try {
            $data = $request->all();
            $ruta = Ruta::find($data["id"]);
            $id = $ruta->rtCodigo;
            $ruta->trImagen = "http://".$_SERVER['HTTP_HOST'].'/image/'.$id.".jpg";            
            $ruta->save();
                        
            if ($request->hasFile('imagen')) {
                $request->file('imagen')->move("../image/", $id.".jpg");
                return JsonResponse::create(array('message' => "Imagen Guardada Correctamente","request"=>  json_encode($id)), 200);
            }            
            
            return JsonResponse::create(array('message' => "Error al Guardar imagen","request"=>  json_encode($id)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar La imagen", "exception"=>$exc->getMessage()), 401);
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
    
    //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $rtCodigo){
        try {
            $data = $request->all();
            $ruta = Ruta::find($rtCodigo);
            $ruta->trEstado = $data['trEstado'];
            $ruta->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($rtCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($rtCodigo)), 401);
        }
    }
}
