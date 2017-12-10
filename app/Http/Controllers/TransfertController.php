<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Transfert;
use Illuminate\Http\JsonResponse;
use DB;

class TransfertController extends Controller
{
    
    public function index()
    {                
        return null;
    }
    
    public function getByPlanitlla($idPlantilla){
        return DB::select("SELECT t.*, cv.tvDescripcion, z.znNombre, zd.znNombre AS destino FROM transfert AS t "
                . " INNER JOIN clasevehiculo AS cv ON t.tfTipoVehiculo = cv.tvCodigo INNER JOIN zona z ON t.tfOrigen = "
                . " z.znCodigo INNER JOIN zona zd ON t.tfDestino = zd.znCodigo WHERE"
                . " tfPlantilla = $idPlantilla AND t.tfEstado <> 'BORRADO'");
    }
    
    public function  GetTarifasActivas(){
        return Transfert::where('tfEstado', 'ACTIVO')->get();
    }
    
    public function getPrecioTransfert($plantilla, $tipovehiculo, $origen, $destino){
        return Transfert::select('tfCodigo', 'tfNombre', 'tfValor', 'tfValorCliente')
                ->where('tfPlantilla', $plantilla)
                ->where('tfTipoVehiculo', $tipovehiculo)
                ->where('tfOrigen', $origen)
                ->where('tfDestino', $destino)->first();
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
            $transfert->tfValorCliente = $data["tfValorCliente"]; 
            $transfert->tfUserReg = $data["tfUserReg"]; 
            $transfert->tfUserMod = $data["tfUserReg"]; 
            $transfert->tfEstado = $data["tfEstado"]; 
            $transfert->tfPlantilla = $data["tfPlantilla"];            
            $transfert->tfFechaMod = new \DateTime();         
            $transfert->save();
            
            return JsonResponse::create(array('message' => "Vehiculo guardado correctamente", "request" =>json_encode($transfert->tfCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
            $transfert->tfValorCliente = $data["tfValorCliente"]; 
            $transfert->tfUserMod = $data["tfUserMod"]; 
            $transfert->tfEstado = $data["tfEstado"]; 
            $transfert->tfPlantilla = $data["tfPlantilla"]; 
            $transfert->tfFechaMod = new \DateTime();         
            $transfert->save();
            
            return JsonResponse::create(array('message' => "Vehiculo guardado correctamente", "request" =>json_encode($transfert->tfCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }   
    }
    
    public function UpdateEstado(Request $request, $id){
        try {            
            $data = $request->all();
            $taxi = Transfert::find($id);
            $taxi->tfEstado = $data['estado'];
            $taxi->save();
            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($id)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }        
    
    public function plantillaExcel(){
        try {
            
            $fecha =date("Ymd");
                       
            \Excel::create('PlantillaTransfert_'.$fecha, function($excel) {               
                
                $zonas= \App\Zona::select('znCodigo', 'znNombre')->where('znEstado', '<>','BORRADO')
                                ->orderBy('znCodigo', 'asc')->get(); 
                
                $tipoVehiculos = \App\TipoVehiculo::where('tvEstado','<>','BORRADO')
                        ->select("tvDescripcion", "tvNumPasajero")->get();
                
                $claseVehiculo= $tipoVehiculos[2];
                
                $color = "#e7e7e7";
                
                $excel->sheet('Transfert', function($sheet) use($zonas, $color, $claseVehiculo) {
                                                            
                    $sheet->row(1, array( 'Descripcion', 'Zona Origen', "Zona Destino", "Valor Cliente", "Valor Proveedor", "Tipo Vehículo" ));                    
                    $sheet->row(1, function($row) use($color) {   
                        $row->setBackground($color);
                    });
                    
                    $zona = $zonas[0];
                    
                    foreach($zonas as $index => $tipo) {
                        $sheet->row($index+2, [
                            "", $zona['znNombre'], $tipo->znNombre, "", "", $claseVehiculo['tvDescripcion']
                        ]); 
                    }                                        
                });
                
                $excel->sheet('Zonas', function($sheet) use($zonas, $color) {
                                                                        
                    $sheet->row(1, array( 'ID', 'Nombre Zona' ));
                    
                    $sheet->row(1, function($row) use($color) {   
                        $row->setBackground($color);
                    });
                                 
                    foreach($zonas as $index => $tipo) {
                        $sheet->row($index+2, [
                            $tipo->znCodigo, $tipo->znNombre
                        ]); 
                    }
                });
                                     
                $excel->sheet('TipoVehiculo', function($sheet) use ($tipoVehiculos, $color) {                                           
                    $sheet->row(1, array( 'Tipo Vehículo', 'N. Pasajeros' ));
                    
                    $sheet->row(1, function($row) use ($color) {   
                        $row->setBackground($color);
                    });
                                 
                    foreach($tipoVehiculos as $index => $tipo) {
                        $sheet->row($index+2, [
                            $tipo->tvDescripcion, $tipo->tvNumPasajero
                        ]); 
                    }
                });                                
                                
            })->export('xlsx');
            
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
}
