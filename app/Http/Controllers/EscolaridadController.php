<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Escolaridad;
use Illuminate\Http\JsonResponse;
use DB;
class EscolaridadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      // return Escolaridad::all();
         $resul = DB::select("Select * from escolaridad where  esEstado<>'BORRADO' ");
        return $resul;
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
            $escolaridad= new Escolaridad();  
            $escolaridad->esCodigo=$data["esCodigo"];
            $escolaridad->esDescripcion = $data["esDescripcion"];
            $escolaridad->esEstado = $data["esEstado"];                     
            $escolaridad->save();
            
            return JsonResponse::create(array('message' => "Escolaridad guardada correctamente", "request" =>json_encode($escolaridad->esCodigo)), 200);
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
