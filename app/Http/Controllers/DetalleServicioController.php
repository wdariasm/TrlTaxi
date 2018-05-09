<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\DetalleServicio;
use DB;

class DetalleServicioController extends Controller
{
        
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
            $detalle = new DetalleServicio();             
            
            $detalle->dtServicioId = $data["dtServicioId"];
            $detalle->dtNumHoras = $data["dtNumHoras"];            
            $detalle->dtValorHora = $data["dtValorHora"];                      
            $detalle->dtValorTotal = $data["dtValorTotal"];
            $detalle->dtResponsable = $data["dtResponsable"];                      
            $detalle->dtObservacion = $data["dtObservacion"];
            $detalle->dtUser = $data["dtUser"];
            $detalle->dtEstado = "ACTIVO";
            
            $date = new \DateTime(str_replace("/", "-", $data["dtFechaInicio"]." 00:00:00"));
            $detalle->dtFechaInicio = $date->format('Y-m-d');
            $hora = \DateTime::createFromFormat( 'H:i A', $data["dtHoraInicio"]);
            $detalle->dtHoraInicio= $hora->format('H:i:s'); 
            
            $date1 = new \DateTime(str_replace("/", "-", $data["dtFechaFin"]." 00:00:00"));
            $detalle->dtFechaFin = $date1->format('Y-m-d');
            $hora2 = \DateTime::createFromFormat( 'H:i A', $data["dtHoraFin"]);
            $detalle->dtHoraFin= $hora2->format('H:i:s');
            
            $valorTotal = (int)$detalle->dtValorTotal;
            $horas = (int)$detalle->dtNumHoras;
                                    
            $detalle->save();
            
            DB::update("UPDATE servicio SET ValorTotal = ValorTotal + $valorTotal, NumHoras = NumHoras + $horas  WHERE IdServicio = ".$detalle->dtServicioId);
            
            return JsonResponse::create(array('message' => "Datos guardados correctamente", "request" =>json_encode($detalle->dtCodigo)), 200);
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
        return DetalleServicio::where("dtServicioId", $id)->where("dtEstado", 'ACTIVO')->get();
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
            $detalle = DetalleServicio::find($id);
            $detalle->dtEstado = 'INACTIVO';
            $detalle->dtUserActualizacion = $data["dtUser"];
            $detalle->dtFechaActualizacion =new \DateTime();

            $valorTotal = $detalle->dtValorTotal;
            $horas = $detalle->dtNumHoras;

            $detalle->save();

            DB::update("UPDATE servicio SET ValorTotal = ValorTotal - $valorTotal, NumHoras = NumHoras - $horas  WHERE IdServicio = ".$detalle->dtServicioId);
            return JsonResponse::create(array('message' => "Disponibilidad eliminada correctamente", "request" =>json_encode($detalle->dtCodigo)), 200);
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
        
    }
}
