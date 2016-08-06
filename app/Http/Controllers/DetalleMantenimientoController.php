<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DetalleMantenimiento;
use Illuminate\Http\JsonResponse;


class DetalleMantenimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         return DetalleMantenimiento::all();
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
            $detMantenimiento= new DetalleMantenimiento();                        
            $detMantenimiento->detActividad = $data["detActividad"];
            $detMantenimiento->detValor = $data["detValor"]; 
            $detMantenimiento->detMantenimiento = $data["detMantenimiento"]; 
            $detMantenimiento->save();
            
            return JsonResponse::create(array('message' => "Tipo de mantenimineto  guardado correctamente", "request" =>json_encode($detMantenimiento->detCodigo)), 200);
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
    public function update(Request $request, $detCodigo)
    {
          try{
            $data = $request->all();
            $detMantenimiento = DetalleMantenimiento::find($detCodigo);
            $detMantenimiento->detActividad = $data["detActividad"];
            $detMantenimiento->detValor = $data["detValor"];
             $detMantenimiento->detMantenimiento = $data["detMantenimiento"];
            $detMantenimiento->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($detMantenimiento->detCodigo)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
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
