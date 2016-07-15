<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Vehiculo;
use Illuminate\Http\JsonResponse;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {        
        
        return Vehiculo::join('clasevehiculo', 'vehiculo.ClaseVehiculo', '=', 'clasevehiculo.tvCodigo')
                ->select('vehiculo.*','clasevehiculo.tvDescripcion')
                ->orderBy('vehiculo.IdVehiculo', 'desc')
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
            $vehiculo= new Vehiculo();                        
            $vehiculo->IdVehiculo = $data["IdVehiculo"];
            $vehiculo->Placa = $data["Placa"]; 
            $vehiculo->Marca = $data["Marca"]; 
            $vehiculo->Modelo = $data["Modelo"]; 
            $vehiculo->Color = $data["Color"]; 
            $vehiculo->Cilindraje = $data["Cilindraje"]; 
            $vehiculo->Movil = $data["Movil"]; 
            $vehiculo->Estado = $data["Estado"]; 
            $vehiculo->Tipo = $data["Tipo"]; 
            $date = new \DateTime(str_replace("/", "-", $data["FechaArriendo"]));
            $vehiculo->FechaArriendo = $date->format('Y-m-d H:i:s');
            $vehiculo->NumPasajeros = $data["NumPasajeros"]; 
            $vehiculo->ClaseVehiculo = $data["ClaseVehiculo"]; 
            $vehiculo->Runt = $data["Runt"]; 
            $date2 = new \DateTime(str_replace("/", "-",$data["FProxMantenimiento"]));            
            $vehiculo->FProxMantenimiento = $date2->format('Y-m-d H:i:s');

            $vehiculo->save();
            
            return JsonResponse::create(array('message' => "Vehiculo guardado correctamente", "request" =>json_encode($vehiculo->IdVehiculo)), 200);
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