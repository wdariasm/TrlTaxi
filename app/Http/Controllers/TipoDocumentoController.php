<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoDocumento;
use Illuminate\Http\JsonResponse;
use DB;

class TipoDocumentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        $resul = DB::select("Select * from tipodocumento where  tdEstado<>'BORRADO' ");
        return $resul;
        //return TipoDocumento::select("tdCodigo", "tdDescripcion")->get();
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
            $tipoDocumento= new TipoDocumento();  
            $tipoDocumento->tdCodigo=$data["tdCodigo"];
            $tipoDocumento->tdDescripcion = $data["tdDescripcion"];
            $tipoDocumento->tdEstado = $data["tdEstado"];                     
            $tipoDocumento->save();
            
            return JsonResponse::create(array('message' => "Tipo de Documento guardado correctamente", "request" =>json_encode($tipoDocumento->tdCodigo)), 200);
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
    public function update(Request $request, $tdCodigo)
    {
        try{
            $data = $request->all();
            $tipoDocumento= TipoDocumento::find($tdCodigo);
            $tipoDocumento->tdDescripcion = $data["tdDescripcion"];
            $tipoDocumento->tdEstado = $data["tdEstado"];
            $tipoDocumento->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($tipoDocumento->tdCodigo)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($request)), 401);
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
      public function updateEstado(Request $request, $tdCodigo){
        try {
            $data = $request->all();
            $tipoDocumento = TipoDocumento::find($tdCodigo);
            $tipoDocumento->tdEstado = $data['tdEstado'];
            $tipoDocumento->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($tdCodigo)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Taxista", "exception"=>$ex->getMessage(), "request" =>json_encode($tdCodigo)), 401);
        }
    }
}
