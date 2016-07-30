<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Transfert;
use Illuminate\Http\JsonResponse;

class TransfertController extends Controller
{
    
    public function index()
    {                
        return Transfert::join('clasevehiculo', 'transfert.tfTipoVehiculo', '=', 'clasevehiculo.tvCodigo')
                ->join('zona', 'transfert.tfOrigen', '=', 'zona.znCodigo')
                ->where('transfert.tfEstado', '<>', 'BORRADO')
                ->select('transfert.*','clasevehiculo.tvDescripcion', 'zona.znNombre')                
                ->get();
    }
    
    public function  GetTarifasActivas(){
        return Transfert::where('tfEstado', 'ACTIVO')->get();
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
    
    public function store(Request $request)
    {
       try{  
            $data = $request->all(); 
            $transfert= new Transfert();                        
            $transfert->tfNombre = $data["tfNombre"];
            $transfert->tfOrigen = $data["tfOrigen"]; 
            $transfert->tfDestino = $data["tfDestino"]; 
            $transfert->tfTipoVehiculo = $data["tfTipoVehiculo"]; 
            $transfert->tfValor = $data["tfValor"]; 
            $transfert->tfUserReg = $data["tfUserReg"]; 
            $transfert->tfUserMod = $data["tfUserReg"]; 
            $transfert->tfEstado = $data["tfEstado"]; 
            $transfert->tfFechaMod = new \DateTime();         
            $transfert->save();
            
            return JsonResponse::create(array('message' => "Vehiculo guardado correctamente", "request" =>json_encode($transfert->tfCodigo)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    public function update(Request $request, $id)
    {
        try{  
            $data = $request->all();                
            $transfert = Transfert::find($id);
            $transfert->tfNombre = $data["tfNombre"];
            $transfert->tfOrigen = $data["tfOrigen"]; 
            $transfert->tfDestino = $data["tfDestino"]; 
            $transfert->tfTipoVehiculo = $data["tfTipoVehiculo"]; 
            $transfert->tfValor = $data["tfValor"];             
            $transfert->tfUserMod = $data["tfUserMod"]; 
            $transfert->tfEstado = $data["tfEstado"]; 
            $transfert->tfFechaMod = new \DateTime();         
            $transfert->save();
            
            return JsonResponse::create(array('message' => "Vehiculo guardado correctamente", "request" =>json_encode($transfert->tfCodigo)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    public function UpdateEstado(Request $request, $id){
        try {            
            $data = $request->all();
            $taxi = Transfert::find($id);
            $taxi->tfEstado = $data['estado'];
            $taxi->save();
            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($id)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo modificar el Vehiculo", "request" =>json_encode($ex->getMessage())), 401);
        }
    }
}
