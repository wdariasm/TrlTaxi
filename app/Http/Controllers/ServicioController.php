<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;
    use Illuminate\Http\JsonResponse;
class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       //return Servicio::all();
         return Servicio::where('svEstado','<>','BORRADO')
                ->get();
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
            $servicio= new Servicio();                        
            $servicio->svDescripcion = $data["svDescripcion"];
            $servicio->svEstado = $data["svEstado"];                     
            $servicio->save();
            
            return JsonResponse::create(array('message' => "Servicio guardado correctamente", "request" =>json_encode($servicio->svCodigo)), 200);
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function show($svCodigo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function edit($svCodigo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $svCodigo)
    {
       try{
            $data = $request->all();
            $marca = Marca::find($svCodigo);
            $marca->svDescripcion = $data["svDescripcion"];
            $marca->svEstado = $data["svEstado"];
            $marca->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($marca->svCodigo)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($request)), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $svCodigo
     * @return \Illuminate\Http\Response
     */
    public function destroy($svCodigo)
    {
        //
    }
    
    
    
     //Actualiza el estado (Funcion eliminar)
      public function updateEstado(Request $request, $svCodigo){
        try {
            $data = $request->all();
            $marca = Servicio::find($svCodigo);
            $marca->svEstado = $data['svEstado'];
            $marca->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($svCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($svCodigo)), 401);
        }
    }
}
