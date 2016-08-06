<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mantenimiento;

class MantenimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Mantenimiento::all();
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
            $mantenimiento= new Mantenimiento();                        
            $mantenimiento->Descripcion = $data["Descripcion"];
            $mantenimiento->TotalFactura = $data["TotalFactura"]; 
            $date1 = new \DateTime( str_replace("/", "-",  $data["Fecha"]));
            $mantenimiento->Fecha =  $date1->format('Y-m-d H:i:s');        
            $mantenimiento->mtVehiculo = $data["mtVehiculo"]; 
            $mantenimiento->mtTipoMantenimiento = $data["mtTipoMantenimiento"]; 
            
            $mantenimiento->save();
            
            return JsonResponse::create(array('message' => "Novedad guardada correctamente", "request" =>json_encode($mantenimiento->IdMantenimiento)), 200);
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
       try{
            $data = $request->all();
            $mantenimiento = Mantenimiento::find($id);   
            $mantenimiento->Descripcion = $data["Descripcion"];
            $mantenimiento->TotalFactura = $data["TotalFactura"]; 
            $date1 = new \DateTime($data["Fecha"]);
            $mantenimiento->Fecha =  $date1->format('Y-m-d H:i:s');                    
            $mantenimiento->mtVehiculo = $data["mtVehiculo"]; 
            $mantenimiento->mtTipoMantenimiento = $data["mtTipoMantenimiento"]; 
            
            $mantenimiento->save();

            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($mantenimiento->IdMantenimiento)), 200);
        } catch (Exception $exc) {
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
