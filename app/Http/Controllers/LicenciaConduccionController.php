<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\LicenciaConduccion;
use Illuminate\Http\JsonResponse;

class LicenciaConduccionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return LicenciaConduccion::all();
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
            $licencia= new LicenciaConduccions();                        
            $licencia->Numero = $data["Numero"];
            $licencia->OTLicencia = $data["OTLicencia"];  
            $date = new \DateTime(str_replace("/", "-", $data["FechaExpedicion"]));
            $licencia->FechaExpedicion = $date->format('Y-m-d H:i:s');
            $date2 = new \DateTime(str_replace("/", "-",$data["FechaVencimiento"]));            
            $licencia->FechaVencimiento= $date2->format('Y-m-d H:i:s');
            $licencia->Categoria = $data["Categoria"];
            $licencia->lcConductor = $data["lcConductor"];

            $licencia->save();
            
            return JsonResponse::create(array('message' => "licencia guardada correctamente", "request" =>json_encode($licencia->IdLicencia)), 200);
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
