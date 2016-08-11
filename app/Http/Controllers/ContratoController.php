<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
use DB;
use App\Contrato;
use App\Parametro;
use App\ContratoDisponibilidad;
use App\ContratoPlantilla;

class ContratoController extends Controller
{
    
    public function index(){
        return Contrato::take(20)->get();
    }
    
    public function tipoContrato (){
        return DB::select("select * from tipocontrato");
    }    
    
    public function store(Request $request)
    {
        try{  
            $data = $request->all(); 
            $contrato= new Contrato();                        
            $contrato->ctClienteId = $data["ctClienteId"];
            $contrato->ctNitCliente = $data["ctNitCliente"]; 
            $contrato->ctContratante = $data["ctContratante"]; 
            $contrato->ctTelefono = $data["ctTelefono"]; 
            $date = new \DateTime(str_replace("/", "-", $data["ctFechaInicio"]));            
            $contrato->ctFechaInicio = $date->format('Y-m-d H:i:s'); 
            $date2 = new \DateTime(str_replace("/", "-", $data["ctFechaFinal"]));
            $contrato->ctFechaFinal = $date2->format('Y-m-d H:i:s');             
            $contrato->ctObjeto = $data["ctObjeto"];             
            $contrato->ctNumeroContrato = substr(uniqid(), 1,7);
            $contrato->ctRecorridos = $data["ctRecorridos"]; 
            $contrato->ctDuracion = $data["ctDuracion"]; 
            $contrato->ctNumVehiculos = $data["ctNumVehiculos"];
            $contrato->ctTipoContrato = $data["ctTipoContrato"];
            $contrato->ctUsuarReg = $data["ctUsuarReg"];
            $contrato->save();
            
            $numeroCto = $this->numeroContrato($contrato->IdContrato);
            if($numeroCto !== "Correcto"){
                return $numeroCto;
            }             
            $disponibilidad = $data["Disponibilidad"];            
            $plantillas = $data["Plantillas"];
            $tipoServicio = $data["TipoServicio"];
            
            $this->llenarServicios($contrato->IdContrato, $tipoServicio, $disponibilidad, $plantillas);                        
                                               
            return JsonResponse::create(array('message' => "Contrato  guardado correctamente", "request" =>json_encode($contrato->IdContrato)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    
    //FUNCIONES PRIVADAS //
    
    private function llenarServicios($idContrato, $tipoServicio, $disponibilidad, $plantillas){
        try{            
            foreach ($tipoServicio as $ts) {
                $insert = new ContratoPlantilla();
                $insert->csContratoId =$idContrato;
                $insert->csTipoServicioId = $ts['svCodigo'];
                $insert->csDescripcion = $ts['svDescripcion'];
                $insert->csPlantilla = $ts['svPlantilla'];                
                $insert->save();
            }
            
            if(count($plantillas) > 0){
                foreach ($plantillas as $p) {
                    $insert = new ContratoPlantilla();
                    $insert->pcContratoId =$idContrato;
                    $insert->pcPlantillaId = $p['plCodigo'];
                    $insert->pcTipoServicio = $p['plTipoServicio'];
                    $insert->pcEstado = "ACTIVO";
                    $insert->save();
                }
            }
            
            if(count($disponibilidad) > 0){
                foreach ($disponibilidad as $d) {
                    $insert = new ContratoDisponibilidad();
                    $insert->dcContratoId =$idContrato;
                    $insert->dcDisponibilidad = $d['dpCodigo'];
                    $insert->dcEstado = "ACTIVO";
                    $insert->save();
                }
            }                      
            
        }catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }        
    }


    private function validarNumeroContrato ($numero){        
        $valor = DB::select("SELECT IdContrato FROM contrato WHERE ctNumeroContrato='$numero' LIMIT 1");        
        return empty($valor);            
    }
        
    private function numeroContrato ($idContrato){  
        try {
            $parametro = Parametro::find(1);        
            if(!isset($parametro)){
                return "Error, no existe parametro para el consecutivo.";
            }

            $finished = false;   
            $acum = 0;
            while (!$finished) {
                $acum +=1;
                $numero =date("y") . str_pad($parametro->parConsecutivo, 5, "0", STR_PAD_LEFT);
                $finished=  $this->validarNumeroContrato($numero);
                $parametro->parConsecutivo +=1;  
                if($acum > 5){
                    $finished=true;
                }                                      
            }
            DB::update("UPDATE  contrato SET  ctNumeroContrato='$numero' WHERE IdContrato=$idContrato");
            $parametro->save();
            return "Correcto";
        }catch (\Exception $exc) {    
            return $exc->getMessage();
        }
        
    }
    
}
