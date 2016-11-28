<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mantenimiento;
use App\DetalleMantenimiento;
use Illuminate\Http\JsonResponse;
use DB;


class MantenimientoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
           $result = DB::select("SELECT m.Descripcion, m.TotalFactura,  m.Fecha, de.detActividad, de.detValor, p.Placa,"
                . "  tm.tmDescripcion FROM mantenimiento m INNER JOIN vehiculo p ON m.mtVehiculo= p.IdVehiculo"
                . " INNER JOIN tipomantenimiento tm ON m.mtTipoMantenimiento=tm.tmCodigo INNER JOIN detallemantenimiento de ON de.detMantenimiento=m.IdMantenimiento");
        return $result; 
    }
    
    public function detallePorId($idMantenimiento){
        return DetalleMantenimiento::where('detMantenimiento', $idMantenimiento)->get();
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
            
            $detalle = $data["DetalleMantenimientos"];
            foreach ($detalle as $d){
                $insert = new DetalleMantenimiento();
                $insert->detMantenimiento=$mantenimiento->IdMantenimiento;
                $insert->detActividad = $d["detActividad"];
                $insert->detValor = $d["detValor"];          
                $insert->save();                        
            }
            
            return JsonResponse::create(array('message' => "Mantenimiento guardado correctamente", "request" =>json_encode($mantenimiento->IdMantenimiento)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $IdMantenimiento)
    {
       try{
            $data = $request->all();
            $mantenimiento = Mantenimiento::find($IdMantenimiento);   
            $mantenimiento->Descripcion = $data["Descripcion"];
            $mantenimiento->TotalFactura = $data["TotalFactura"]; 
            $date1 = new \DateTime($data["Fecha"]);
            $mantenimiento->Fecha =  $date1->format('Y-m-d H:i:s');                    
            $mantenimiento->mtVehiculo = $data["mtVehiculo"]; 
            $mantenimiento->mtTipoMantenimiento = $data["mtTipoMantenimiento"]; 
            
            $mantenimiento->save();

            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($mantenimiento->IdMantenimiento)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function updateDetalle(Request $request, $detCodigo){
       try{
            $data = $request->all();
            $insert = DetalleMantenimiento::find($detCodigo);
            $insert->detActividad = $data["detActividad"];
            $insert->detValor = $data["detValor"];          
            $insert->save();                       
            
            return JsonResponse::create(array('message' => " Detalle Actualizado Correctamente", "request" =>json_encode($insert->detCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    
      //guardarDetalle
    public function GuardarDetalle(Request $request){
        try{  
                $data = $request->all(); 
                $insert = new DetalleMantenimiento();
                $insert->detActividad=$data["detActividad"];
                $insert->detValor=$data["detValor"];
                $insert->detMantenimiento=$data["detMantenimiento"];

                $insert->save();
            return JsonResponse::create(array('message' => "Detalle  guardado correctamente", "request" =>json_encode($insert->detCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
