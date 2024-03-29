<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
use DB;
use App\Contrato;
use App\Parametro;
use App\ContratoDisponibilidad;
use App\ContratoPlantilla;
use App\ContratoTipoServicio;


class ContratoController extends Controller
{
    
    public function index(){
        try{
            return Contrato::all();      
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } catch (Exception $ex) {
            return JsonResponse::create(array('file' => $ex->getFile(), "line"=> $ex->getLine(),  "message" =>json_encode($ex)), 500);
        }
    }
    
    public function tipoContrato (){
        try{
            return DB::select("select * from tipocontrato");        
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    public function  getPorNumeroContrato($contrato){
        try {
            $result =  Contrato::where('ctNumeroContrato', $contrato)->first();
            if(!empty($result)){
                $result->TipoServicio = ContratoTipoServicio::where('csContratoId', $result->IdContrato)->get();
                $result->Plantilla = ContratoPlantilla::join("plantilla", 'contratoplantilla.pcPlantillaId', '=', 'plantilla.plCodigo')
                        ->select("contratoplantilla.pcCodigo","contratoplantilla.pcTipoServicio","plantilla.plCodigo", "plantilla.plDescripcion")
                        ->where('pcContratoId', $result->IdContrato)->get();

            }
            return $result;
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    function getContratoByCliente($id, $estado) {
        
        if ($estado === "Todos"){
            return Contrato::where('ctClienteId', $id)->get();
        }else{
            return Contrato::where('ctClienteId', $id)->where('ctEstado',$estado)->get();
        }
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
            $contrato->ctFormaPago = json_encode($data["ctFormaPago"]);            
            $contrato->save();
            
            $numeroCto = $this->numeroContrato($contrato->IdContrato);
            if($numeroCto !== "Correcto"){                
                return $numeroCto;
            }             
                     
            $plantillas = $data["Plantillas"];
            $tipoServicio = $data["TipoServicio"];            
                        
            $msj = $this->llenarServicios($contrato->IdContrato, $tipoServicio, $plantillas);
            if($msj !=="Correcto"){
                return $msj;
            }            
            return JsonResponse::create(array('message' => "Contrato  guardado correctamente", "request" =>json_encode($contrato->IdContrato)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    
    //FUNCIONES PRIVADAS //
    
    private function llenarServicios($idContrato, $tipoServicio, $plantillas){
        try{                        
            
            foreach ($tipoServicio as $ts) {
                $insert = new ContratoTipoServicio();
                $insert->csContratoId =$idContrato;
                $insert->csTipoServicioId = $ts['svCodigo'];
                $insert->csDescripcion = $ts['svDescripcion'];
                $insert->csPlantilla = $ts['svPlantilla'];
                $insert->csValor = $ts['svValorParada'];                
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
            
            return "Correcto";
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }        
    }
    
    public function update(Request $request, $id)
    {
         try{
            $data = $request->all();
            $contrato = Contrato::find($id);            
            $contrato->ctNitCliente = $data["ctNitCliente"]; 
            $contrato->ctContratante = $data["ctContratante"]; 
            $contrato->ctTelefono = $data["ctTelefono"]; 
            $date = new \DateTime(str_replace("/", "-", $data["ctFechaInicio"]));            
            $contrato->ctFechaInicio = $date->format('Y-m-d H:i:s'); 
            $date2 = new \DateTime(str_replace("/", "-", $data["ctFechaFinal"]));
            $contrato->ctFechaFinal = $date2->format('Y-m-d H:i:s');                                                 
            $contrato->ctDuracion = $data["ctDuracion"];             
            $contrato->ctTipoContrato = $data["ctTipoContrato"];
            $contrato->ctUsuarReg = $data["ctUsuarReg"];
            $contrato->ctFormaPago = json_encode($data["ctFormaPago"]); 
            $contrato->save();
            
            ContratoTipoServicio::where('csContratoId',$id)->delete();                        
            ContratoPlantilla::where('pcContratoId',$id)->delete();
                                                
            $plantillas = $data["Plantillas"];
            $tipoServicio = $data["TipoServicio"];            
                        
            $msj = $this->llenarServicios($id, $tipoServicio, $plantillas);
            if($msj !=="Correcto"){
                return $msj;
            }            
            
            return JsonResponse::create(array('message' => "Contrato Actualizado Correctamente", "request" =>json_encode($id)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            DB::update("update contrato set ctEstado = 'CANCELADO',  ctFechaActualizacion = NOW()  WHERE IdContrato = $id ");
             return JsonResponse::create(array('message' => 'Contrato cancelado correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }         
    }
    
}
